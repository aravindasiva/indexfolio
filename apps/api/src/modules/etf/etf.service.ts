import type { PrismaClient, Prisma } from '@indexfolio/db'
import { AppError, ErrorCode } from '../../shared/error.js'
import type {
  EtfListQuery,
  EtfResponse,
  EtfListItem,
  EtfDetail,
  EtfListResponse,
  EtfFiltersResponse,
} from './etf.schema.js'

// A fund trades on many venues; pull them all (with their exchange), primary first.
const withAllListings = {
  listings: {
    orderBy: { isPrimary: 'desc' as const },
    include: { exchange: true },
  },
} satisfies Prisma.ETFInclude

type EtfWithListings = Prisma.ETFGetPayload<{ include: typeof withAllListings }>

// Fund-level facts, taken from the primary listing. `matchedTicker` is the venue the request
// resolved to (the searched or routed ticker); it falls back to the primary.
function serializeEtf(
  etf: EtfWithListings,
  matchedTicker: string,
): EtfResponse {
  const primary = etf.listings.find((l) => l.isPrimary) ?? etf.listings[0]
  return {
    id: etf.id,
    ticker: primary?.ticker ?? '',
    matchedTicker: matchedTicker || (primary?.ticker ?? ''),
    name: etf.name,
    isin: etf.isin,
    domicile: etf.domicile,
    exchange: primary?.exchange.name ?? '',
    currency: primary?.currency ?? '',
    ter: Number(etf.ter),
    fundSizeEur: etf.fundSizeEur.toString(),
    isAccumulating: etf.isAccumulating,
    isUcits: etf.isUcits,
    indexTracked: etf.indexTracked,
    assetClass: etf.assetClass,
    provider: etf.provider,
    inceptionDate: etf.inceptionDate?.toISOString() ?? null,
  }
}

// The venue whose ticker the user searched, so a row shows EUNL when they typed EUNL rather than
// always the primary (IWDA). Empty string -> serializeEtf falls back to the primary.
function matchedTickerFor(
  etf: EtfWithListings,
  search: string | undefined,
): string {
  const term = search?.trim().toUpperCase()
  if (!term) return ''
  const hit = etf.listings.find((l) => l.ticker.toUpperCase().includes(term))
  return hit?.ticker ?? ''
}

function serializeListItem(
  etf: EtfWithListings,
  search: string | undefined,
): EtfListItem {
  return {
    ...serializeEtf(etf, matchedTickerFor(etf, search)),
    currencies: [...new Set(etf.listings.map((l) => l.currency))].sort((a, b) =>
      a.localeCompare(b),
    ),
    exchangeCount: new Set(etf.listings.map((l) => l.exchangeMic)).size,
  }
}

function serializeDetail(
  etf: EtfWithListings,
  matchedTicker: string,
): EtfDetail {
  return {
    ...serializeEtf(etf, matchedTicker),
    listings: etf.listings.map((l) => ({
      ticker: l.ticker,
      exchange: l.exchange.name,
      currency: l.currency,
      isPrimary: l.isPrimary,
    })),
  }
}

function buildWhere(query: EtfListQuery): Prisma.ETFWhereInput {
  const where: Prisma.ETFWhereInput = {}

  if (query.search !== undefined && query.search.trim() !== '') {
    const term = query.search.trim()
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { isin: { contains: term, mode: 'insensitive' } },
      {
        listings: { some: { ticker: { contains: term, mode: 'insensitive' } } },
      },
    ]
  }

  if (query.isAccumulating !== undefined) {
    where.isAccumulating = query.isAccumulating === 'true'
  }

  if (query.domicile !== undefined) {
    where.domicile = { in: query.domicile.split(',').map((s) => s.trim()) }
  }

  // Exchange and currency match the SAME listing, so "Borsa Italiana + EUR" means a EUR line on
  // Borsa Italiana, not a fund that trades on Borsa Italiana and, separately, somewhere in EUR.
  const listing: Prisma.ListingWhereInput = {}
  if (query.exchange !== undefined) {
    listing.exchange = {
      name: { in: query.exchange.split(',').map((s) => s.trim()) },
    }
  }
  if (query.currency !== undefined) {
    listing.currency = { in: query.currency.split(',').map((s) => s.trim()) }
  }
  if (Object.keys(listing).length > 0) {
    where.listings = { some: listing }
  }

  if (query.assetClass !== undefined) {
    where.assetClass = query.assetClass
  }

  if (query.maxTer !== undefined) {
    where.ter = { lte: query.maxTer }
  }

  if (query.minFundSize !== undefined) {
    where.fundSizeEur = { gte: query.minFundSize }
  }

  return where
}

export async function getEtfs(
  query: EtfListQuery,
  db: PrismaClient,
): Promise<EtfListResponse> {
  const where = buildWhere(query)
  const skip = (query.page - 1) * query.limit
  const orderBy = {
    [query.sort]: query.order,
  } as Prisma.ETFOrderByWithRelationInput

  const [etfs, total] = await Promise.all([
    db.eTF.findMany({
      where,
      skip,
      take: query.limit,
      orderBy,
      include: withAllListings,
    }),
    db.eTF.count({ where }),
  ])

  return {
    data: etfs.map((etf) => serializeListItem(etf, query.search)),
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  }
}

// A grouped-count row keyed by field name, e.g. { domicile: 'IE', _count: { _all: 14 } }.
type GroupRow<K extends string> = { _count: { _all: number } } & Record<
  K,
  string | null
>

// Map grouped counts to { value, count }, sorted by value. Null group keys (e.g. an
// unmapped assetClass) are dropped - a missing value is not a real facet.
export function toFilterOptions<K extends string>(
  rows: ReadonlyArray<GroupRow<K>>,
  key: K,
): Array<{ value: string; count: number }> {
  const options: Array<{ value: string; count: number }> = []
  for (const row of rows) {
    const value = row[key]
    if (value !== null) options.push({ value, count: row._count._all })
  }
  return options.sort((a, b) => a.value.localeCompare(b.value))
}

// Distinct filter values with counts (faceted search). Domicile/asset class group on the fund;
// exchange counts its listings; currency counts distinct funds (a fund can have several EUR lines).
export async function getEtfFilters(
  db: PrismaClient,
): Promise<EtfFiltersResponse> {
  const [domicile, exchanges, currencyPairs, assetClass] = await Promise.all([
    db.eTF.groupBy({ by: ['domicile'], _count: { _all: true } }),
    db.exchange.findMany({
      where: { listings: { some: {} } },
      select: { name: true, _count: { select: { listings: true } } },
    }),
    db.listing.findMany({
      distinct: ['currency', 'etfId'],
      select: { currency: true },
    }),
    db.eTF.groupBy({ by: ['assetClass'], _count: { _all: true } }),
  ])

  const currencyCounts = new Map<string, number>()
  for (const row of currencyPairs) {
    currencyCounts.set(
      row.currency,
      (currencyCounts.get(row.currency) ?? 0) + 1,
    )
  }

  return {
    domicile: toFilterOptions(domicile, 'domicile'),
    exchange: exchanges
      .map((e) => ({ value: e.name, count: e._count.listings }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    currency: [...currencyCounts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    assetClass: toFilterOptions(assetClass, 'assetClass'),
  }
}

export async function getEtfByTicker(
  ticker: string,
  db: PrismaClient,
): Promise<EtfDetail> {
  const listing = await db.listing.findFirst({
    where: { ticker: ticker.toUpperCase() },
    include: { etf: { include: withAllListings } },
  })

  if (!listing) {
    throw new AppError(404, ErrorCode.NOT_FOUND, `ETF '${ticker}' not found`)
  }

  return serializeDetail(listing.etf, listing.ticker)
}
