import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  listEtfs,
  getEtfByTicker,
} from '../../../src/modules/etf/etf.service.js'
import { EtfListQuerySchema } from '../../../src/modules/etf/etf.schema.js'
import { AppError } from '../../../src/shared/error.js'
import { mockDb, mockEtf } from './etf.mock.js'

beforeEach(() => {
  vi.mocked(mockDb.eTF.findMany).mockResolvedValue([mockEtf])
  vi.mocked(mockDb.eTF.count).mockResolvedValue(1)
  vi.mocked(mockDb.eTF.findUnique).mockResolvedValue(mockEtf)
})

describe('listEtfs - filters', () => {
  it('passes empty where when no filters are given', async () => {
    const query = EtfListQuerySchema.parse({})
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    )
  })

  it('filters isAccumulating true', async () => {
    const query = EtfListQuerySchema.parse({ isAccumulating: 'true' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isAccumulating: true } }),
    )
  })

  it('filters isAccumulating false', async () => {
    const query = EtfListQuerySchema.parse({ isAccumulating: 'false' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isAccumulating: false } }),
    )
  })

  it('filters by a single domicile', async () => {
    const query = EtfListQuerySchema.parse({ domicile: 'IE' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { domicile: { in: ['IE'] } } }),
    )
  })

  it('filters by multiple domiciles (comma-separated)', async () => {
    const query = EtfListQuerySchema.parse({ domicile: 'IE,LU' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { domicile: { in: ['IE', 'LU'] } } }),
    )
  })

  it('trims whitespace in comma-separated domicile values', async () => {
    const query = EtfListQuerySchema.parse({ domicile: 'IE, LU' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { domicile: { in: ['IE', 'LU'] } } }),
    )
  })

  it('filters by multiple exchanges', async () => {
    const query = EtfListQuerySchema.parse({ exchange: 'XETRA,LSE' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { exchange: { in: ['XETRA', 'LSE'] } },
      }),
    )
  })

  it('filters by assetClass', async () => {
    const query = EtfListQuerySchema.parse({ assetClass: 'EQUITY' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { assetClass: 'EQUITY' } }),
    )
  })

  it('filters by maxTer', async () => {
    const query = EtfListQuerySchema.parse({ maxTer: '0.25' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ter: { lte: 0.25 } } }),
    )
  })

  it('filters by minFundSize', async () => {
    const query = EtfListQuerySchema.parse({ minFundSize: '1000000000' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { fundSizeEur: { gte: 1000000000n } },
      }),
    )
  })
})

describe('listEtfs - pagination', () => {
  it('defaults to page 1 with skip 0 and take 20', async () => {
    const query = EtfListQuerySchema.parse({})
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 20 }),
    )
  })

  it('calculates skip correctly for page 2 with limit 5', async () => {
    const query = EtfListQuerySchema.parse({ page: '2', limit: '5' })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 }),
    )
  })

  it('returns correct meta with totalPages', async () => {
    vi.mocked(mockDb.eTF.count).mockResolvedValue(15)
    const query = EtfListQuerySchema.parse({ page: '1', limit: '5' })
    const result = await listEtfs(query, mockDb)
    expect(result.meta).toEqual({ total: 15, page: 1, limit: 5, totalPages: 3 })
  })

  it('rounds totalPages up when there is a remainder', async () => {
    vi.mocked(mockDb.eTF.count).mockResolvedValue(16)
    const query = EtfListQuerySchema.parse({ page: '1', limit: '5' })
    const result = await listEtfs(query, mockDb)
    expect(result.meta.totalPages).toBe(4)
  })
})

describe('listEtfs - sorting', () => {
  it('defaults to sort by ticker asc', async () => {
    const query = EtfListQuerySchema.parse({})
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { ticker: 'asc' } }),
    )
  })

  it('sorts by fundSizeEur desc', async () => {
    const query = EtfListQuerySchema.parse({
      sort: 'fundSizeEur',
      order: 'desc',
    })
    await listEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { fundSizeEur: 'desc' } }),
    )
  })
})

describe('listEtfs - serialization', () => {
  it('serializes fundSizeEur as a string to preserve BigInt precision', async () => {
    const query = EtfListQuerySchema.parse({})
    const result = await listEtfs(query, mockDb)
    expect(typeof result.data[0]?.fundSizeEur).toBe('string')
    expect(result.data[0]?.fundSizeEur).toBe('46200000000')
  })

  it('serializes ter as a number', async () => {
    const query = EtfListQuerySchema.parse({})
    const result = await listEtfs(query, mockDb)
    expect(typeof result.data[0]?.ter).toBe('number')
    expect(result.data[0]?.ter).toBe(0.0022)
  })

  it('serializes inceptionDate as an ISO string', async () => {
    const query = EtfListQuerySchema.parse({})
    const result = await listEtfs(query, mockDb)
    expect(result.data[0]?.inceptionDate).toBe('2019-07-23T00:00:00.000Z')
  })
})

describe('getEtfByTicker', () => {
  it('returns a serialized ETF when found', async () => {
    const result = await getEtfByTicker('VWCE', mockDb)
    expect(result.ticker).toBe('VWCE')
    expect(result.fundSizeEur).toBe('46200000000')
  })

  it('normalizes ticker to uppercase before querying', async () => {
    await getEtfByTicker('vwce', mockDb)
    expect(vi.mocked(mockDb.eTF.findUnique)).toHaveBeenCalledWith({
      where: { ticker: 'VWCE' },
    })
  })

  it('throws a 404 AppError when ETF is not found', async () => {
    vi.mocked(mockDb.eTF.findUnique).mockResolvedValue(null)
    await expect(getEtfByTicker('NOTREAL', mockDb)).rejects.toThrow(AppError)
  })

  it('includes the ticker in the 404 error message', async () => {
    vi.mocked(mockDb.eTF.findUnique).mockResolvedValue(null)
    await expect(getEtfByTicker('NOTREAL', mockDb)).rejects.toMatchObject({
      statusCode: 404,
      message: expect.stringContaining('NOTREAL'),
    })
  })
})
