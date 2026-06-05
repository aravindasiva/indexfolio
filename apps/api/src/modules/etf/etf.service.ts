import type { PrismaClient, Prisma } from '@prisma/client'
import { AppError, ErrorCode } from '../../shared/error.js'
import type {
  EtfListQuery,
  EtfResponse,
  EtfListResponse,
} from './etf.schema.js'

function serializeEtf(etf: {
  id: string
  ticker: string
  name: string
  isin: string
  domicile: string
  exchange: string
  currency: string
  ter: unknown
  fundSizeEur: bigint
  isAccumulating: boolean
  isUcits: boolean
  indexTracked: string
  assetClass: string
  provider: string
  inceptionDate: Date
}): EtfResponse {
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

export async function listEtfs(
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
