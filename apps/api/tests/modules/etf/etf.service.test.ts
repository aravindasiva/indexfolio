import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  getEtfs,
  getEtfByTicker,
  toFilterOptions,
} from '../../../src/modules/etf/etf.service.js'
import { EtfListQuerySchema } from '../../../src/modules/etf/etf.schema.js'
import { AppError } from '../../../src/shared/error.js'
import { mockDb, mockEtf, mockListingWithEtf } from './etf.mock.js'

beforeEach(() => {
  vi.mocked(mockDb.eTF.findMany).mockResolvedValue([mockEtf])
  vi.mocked(mockDb.eTF.count).mockResolvedValue(1)
  vi.mocked(mockDb.listing.findFirst).mockResolvedValue(mockListingWithEtf)
})

describe('getEtfs - filters', () => {
  it('passes empty where when no filters are given', async () => {
    const query = EtfListQuerySchema.parse({})
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    )
  })

  it('filters isAccumulating true', async () => {
    const query = EtfListQuerySchema.parse({ isAccumulating: 'true' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isAccumulating: true } }),
    )
  })

  it('filters isAccumulating false', async () => {
    const query = EtfListQuerySchema.parse({ isAccumulating: 'false' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isAccumulating: false } }),
    )
  })

  it('filters by a single domicile', async () => {
    const query = EtfListQuerySchema.parse({ domicile: 'IE' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { domicile: { in: ['IE'] } } }),
    )
  })

  it('filters by multiple domiciles (comma-separated)', async () => {
    const query = EtfListQuerySchema.parse({ domicile: 'IE,LU' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { domicile: { in: ['IE', 'LU'] } } }),
    )
  })

  it('trims whitespace in comma-separated domicile values', async () => {
    const query = EtfListQuerySchema.parse({ domicile: 'IE, LU' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { domicile: { in: ['IE', 'LU'] } } }),
    )
  })

  it('filters by multiple exchanges through listings', async () => {
    const query = EtfListQuerySchema.parse({
      exchange: 'Xetra,London Stock Exchange',
    })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          listings: {
            some: {
              exchange: { name: { in: ['Xetra', 'London Stock Exchange'] } },
            },
          },
        },
      }),
    )
  })

  it('filters by assetClass', async () => {
    const query = EtfListQuerySchema.parse({ assetClass: 'EQUITY' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { assetClass: 'EQUITY' } }),
    )
  })

  it('filters by maxTer', async () => {
    const query = EtfListQuerySchema.parse({ maxTer: '0.25' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ter: { lte: 0.25 } } }),
    )
  })

  it('filters by minFundSize', async () => {
    const query = EtfListQuerySchema.parse({ minFundSize: '1000000000' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { fundSizeEur: { gte: 1000000000n } },
      }),
    )
  })

  it('builds a case-insensitive OR search across name, isin and listing ticker', async () => {
    const query = EtfListQuerySchema.parse({ search: 'world' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: 'world', mode: 'insensitive' } },
            { isin: { contains: 'world', mode: 'insensitive' } },
            {
              listings: {
                some: { ticker: { contains: 'world', mode: 'insensitive' } },
              },
            },
          ],
        },
      }),
    )
  })

  it('ignores a blank search string', async () => {
    const query = EtfListQuerySchema.parse({ search: '   ' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    )
  })
})

describe('toFilterOptions', () => {
  it('maps grouped rows to value/count and sorts by value', () => {
    const rows = [
      { domicile: 'LU', _count: { _all: 1 } },
      { domicile: 'IE', _count: { _all: 14 } },
    ]
    expect(toFilterOptions(rows, 'domicile')).toEqual([
      { value: 'IE', count: 14 },
      { value: 'LU', count: 1 },
    ])
  })

  it('returns an empty array when there are no rows', () => {
    expect(toFilterOptions([], 'assetClass')).toEqual([])
  })
})

describe('getEtfs - pagination', () => {
  it('defaults to page 1 with skip 0 and take 20', async () => {
    const query = EtfListQuerySchema.parse({})
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 20 }),
    )
  })

  it('calculates skip correctly for page 2 with limit 5', async () => {
    const query = EtfListQuerySchema.parse({ page: '2', limit: '5' })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 }),
    )
  })

  it('returns correct meta with totalPages', async () => {
    vi.mocked(mockDb.eTF.count).mockResolvedValue(15)
    const query = EtfListQuerySchema.parse({ page: '1', limit: '5' })
    const result = await getEtfs(query, mockDb)
    expect(result.meta).toEqual({ total: 15, page: 1, limit: 5, totalPages: 3 })
  })

  it('rounds totalPages up when there is a remainder', async () => {
    vi.mocked(mockDb.eTF.count).mockResolvedValue(16)
    const query = EtfListQuerySchema.parse({ page: '1', limit: '5' })
    const result = await getEtfs(query, mockDb)
    expect(result.meta.totalPages).toBe(4)
  })
})

describe('getEtfs - sorting', () => {
  it('defaults to sort by name asc', async () => {
    const query = EtfListQuerySchema.parse({})
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { name: 'asc' } }),
    )
  })

  it('sorts by fundSizeEur desc', async () => {
    const query = EtfListQuerySchema.parse({
      sort: 'fundSizeEur',
      order: 'desc',
    })
    await getEtfs(query, mockDb)
    expect(vi.mocked(mockDb.eTF.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { fundSizeEur: 'desc' } }),
    )
  })
})

describe('getEtfs - serialization', () => {
  it('serializes fundSizeEur as a string to preserve BigInt precision', async () => {
    const query = EtfListQuerySchema.parse({})
    const result = await getEtfs(query, mockDb)
    expect(typeof result.data[0]?.fundSizeEur).toBe('string')
    expect(result.data[0]?.fundSizeEur).toBe('46200000000')
  })

  it('serializes ter as a number', async () => {
    const query = EtfListQuerySchema.parse({})
    const result = await getEtfs(query, mockDb)
    expect(typeof result.data[0]?.ter).toBe('number')
    expect(result.data[0]?.ter).toBe(0.0022)
  })

  it('serializes inceptionDate as an ISO string', async () => {
    const query = EtfListQuerySchema.parse({})
    const result = await getEtfs(query, mockDb)
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
    expect(vi.mocked(mockDb.listing.findFirst)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ticker: 'VWCE' } }),
    )
  })

  it('throws a 404 AppError when ETF is not found', async () => {
    vi.mocked(mockDb.listing.findFirst).mockResolvedValue(null)
    await expect(getEtfByTicker('NOTREAL', mockDb)).rejects.toThrow(AppError)
  })

  it('includes the ticker in the 404 error message', async () => {
    vi.mocked(mockDb.listing.findFirst).mockResolvedValue(null)
    await expect(getEtfByTicker('NOTREAL', mockDb)).rejects.toMatchObject({
      statusCode: 404,
      message: expect.stringContaining('NOTREAL'),
    })
  })
})
