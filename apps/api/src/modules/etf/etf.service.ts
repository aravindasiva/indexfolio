import type { PrismaClient, Prisma } from '@indexfolio/db'
import { AppError, ErrorCode } from '../../shared/error.js'
import type {
  EtfListQuery,
  EtfResponse,
  EtfListResponse,
  EtfFiltersResponse,
} from './etf.schema.js'

// A fund lists on many venues, so ticker/exchange/currency come from its primary listing.
// Pull that one listing (with its exchange) alongside the fund.
const withPrimaryListing = {
  listings: {
    where: { isPrimary: true },
    take: 1,
    include: { exchange: true },
  },
} satisfies Prisma.ETFInclude

type EtfWithPrimaryListing = Prisma.ETFGetPayload<{
  include: typeof withPrimaryListing
}>

// Map a fund + its primary listing to the JSON contract (EtfResponse).
function serializeEtf(etf: EtfWithPrimaryListing): EtfResponse {
  const primary = etf.listings[0]
  return {
    id: etf.id,
    ticker: primary?.ticker ?? '',
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

  if (query.exchange !== undefined) {
    const names = query.exchange.split(',').map((s) => s.trim())
    where.listings = { some: { exchange: { name: { in: names } } } }
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
      include: withPrimaryListing,
    }),
    db.eTF.count({ where }),
  ])

  return {
    data: etfs.map(serializeEtf),
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

// Distinct filter values with counts (faceted search). Domicile and asset class group on
// the fund; exchange comes from the listings, counted per exchange.
export async function getEtfFilters(
  db: PrismaClient,
): Promise<EtfFiltersResponse> {
  const [domicile, exchanges, assetClass] = await Promise.all([
    db.eTF.groupBy({ by: ['domicile'], _count: { _all: true } }),
    db.exchange.findMany({
      where: { listings: { some: {} } },
      select: { name: true, _count: { select: { listings: true } } },
    }),
    db.eTF.groupBy({ by: ['assetClass'], _count: { _all: true } }),
  ])

  return {
    domicile: toFilterOptions(domicile, 'domicile'),
    exchange: exchanges
      .map((e) => ({ value: e.name, count: e._count.listings }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    assetClass: toFilterOptions(assetClass, 'assetClass'),
  }
}

export async function getEtfByTicker(
  ticker: string,
  db: PrismaClient,
): Promise<EtfResponse> {
  const listing = await db.listing.findFirst({
    where: { ticker: ticker.toUpperCase() },
    include: { etf: { include: withPrimaryListing } },
  })

  if (!listing) {
    throw new AppError(404, ErrorCode.NOT_FOUND, `ETF '${ticker}' not found`)
  }

  return serializeEtf(listing.etf)
}
