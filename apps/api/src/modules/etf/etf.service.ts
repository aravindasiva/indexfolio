import type { PrismaClient, Prisma, ETF } from '@indexfolio/db'
import { AppError, ErrorCode } from '../../shared/error.js'
import type {
  EtfListQuery,
  EtfResponse,
  EtfListResponse,
  EtfFiltersResponse,
} from './etf.schema.js'

// Map a Prisma ETF row to the JSON contract (EtfResponse) without retyping.
function serializeEtf(etf: ETF): EtfResponse {
  return {
    id: etf.id,
    ticker: etf.ticker,
    name: etf.name,
    isin: etf.isin,
    domicile: etf.domicile,
    exchange: etf.exchange,
    currency: etf.currency,
    ter: Number(etf.ter),
    fundSizeEur: etf.fundSizeEur.toString(),
    isAccumulating: etf.isAccumulating,
    isUcits: etf.isUcits,
    indexTracked: etf.indexTracked,
    assetClass: etf.assetClass,
    provider: etf.provider,
    inceptionDate: etf.inceptionDate.toISOString(),
  }
}

function buildWhere(query: EtfListQuery): Prisma.ETFWhereInput {
  const where: Prisma.ETFWhereInput = {}

  if (query.search !== undefined && query.search.trim() !== '') {
    const term = query.search.trim()
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { ticker: { contains: term, mode: 'insensitive' } },
      { isin: { contains: term, mode: 'insensitive' } },
    ]
  }

  if (query.isAccumulating !== undefined) {
    where.isAccumulating = query.isAccumulating === 'true'
  }

  if (query.domicile !== undefined) {
    where.domicile = { in: query.domicile.split(',').map((s) => s.trim()) }
  }

  if (query.exchange !== undefined) {
    where.exchange = { in: query.exchange.split(',').map((s) => s.trim()) }
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
    db.eTF.findMany({ where, skip, take: query.limit, orderBy }),
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
  string
>

// Map grouped counts to { value, count }, sorted by value.
export function toFilterOptions<K extends string>(
  rows: ReadonlyArray<GroupRow<K>>,
  key: K,
): Array<{ value: string; count: number }> {
  return rows
    .map((row) => ({ value: row[key], count: row._count._all }))
    .sort((a, b) => a.value.localeCompare(b.value))
}

// Distinct filter values with counts (faceted search): one GROUP BY per categorical field.
export async function getEtfFilters(
  db: PrismaClient,
): Promise<EtfFiltersResponse> {
  const [domicile, exchange, assetClass] = await Promise.all([
    db.eTF.groupBy({ by: ['domicile'], _count: { _all: true } }),
    db.eTF.groupBy({ by: ['exchange'], _count: { _all: true } }),
    db.eTF.groupBy({ by: ['assetClass'], _count: { _all: true } }),
  ])

  return {
    domicile: toFilterOptions(domicile, 'domicile'),
    exchange: toFilterOptions(exchange, 'exchange'),
    assetClass: toFilterOptions(assetClass, 'assetClass'),
  }
}

export async function getEtfByTicker(
  ticker: string,
  db: PrismaClient,
): Promise<EtfResponse> {
  const etf = await db.eTF.findUnique({
    where: { ticker: ticker.toUpperCase() },
  })

  if (!etf) {
    throw new AppError(404, ErrorCode.NOT_FOUND, `ETF '${ticker}' not found`)
  }

  return serializeEtf(etf)
}
