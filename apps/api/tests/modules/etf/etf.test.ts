import { describe, expect, it } from 'vitest'
import {
  EtfListQuerySchema,
  EtfParamsSchema,
} from '../../../src/modules/etf/etf.schema.js'

describe('EtfParamsSchema', () => {
  it('parses a valid ticker', () => {
    expect(EtfParamsSchema.parse({ ticker: 'VWCE' })).toEqual({
      ticker: 'VWCE',
    })
  })

  it('rejects an empty ticker', () => {
    expect(() => EtfParamsSchema.parse({ ticker: '' })).toThrow()
  })

  it('rejects a ticker over 20 characters', () => {
    expect(() => EtfParamsSchema.parse({ ticker: 'A'.repeat(21) })).toThrow()
  })
})

describe('EtfListQuerySchema', () => {
  it('applies default pagination values', () => {
    const result = EtfListQuerySchema.parse({})
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
  })

  it('rejects a limit above 100', () => {
    expect(() => EtfListQuerySchema.parse({ limit: 101 })).toThrow()
  })

  it('rejects page less than 1', () => {
    expect(() => EtfListQuerySchema.parse({ page: 0 })).toThrow()
  })

  it('coerces page and limit from strings', () => {
    const result = EtfListQuerySchema.parse({ page: '2', limit: '10' })
    expect(result.page).toBe(2)
    expect(result.limit).toBe(10)
  })

  it('parses isAccumulating true', () => {
    const result = EtfListQuerySchema.parse({ isAccumulating: 'true' })
    expect(result.isAccumulating).toBe('true')
  })

  it('parses isAccumulating false', () => {
    const result = EtfListQuerySchema.parse({ isAccumulating: 'false' })
    expect(result.isAccumulating).toBe('false')
  })

  it('rejects invalid isAccumulating value', () => {
    expect(() => EtfListQuerySchema.parse({ isAccumulating: 'yes' })).toThrow()
  })

  it('parses domicile as a string', () => {
    const result = EtfListQuerySchema.parse({ domicile: 'IE,LU' })
    expect(result.domicile).toBe('IE,LU')
  })

  it('parses exchange as a string', () => {
    const result = EtfListQuerySchema.parse({ exchange: 'XETRA,LSE' })
    expect(result.exchange).toBe('XETRA,LSE')
  })

  it('parses assetClass', () => {
    const result = EtfListQuerySchema.parse({ assetClass: 'EQUITY' })
    expect(result.assetClass).toBe('EQUITY')
  })

  it('coerces maxTer from string', () => {
    const result = EtfListQuerySchema.parse({ maxTer: '0.50' })
    expect(result.maxTer).toBe(0.5)
  })

  it('rejects maxTer of zero', () => {
    expect(() => EtfListQuerySchema.parse({ maxTer: '0' })).toThrow()
  })

  it('coerces minFundSize to bigint', () => {
    const result = EtfListQuerySchema.parse({ minFundSize: '1000000000' })
    expect(result.minFundSize).toBe(1000000000n)
  })

  it('defaults sort to ticker', () => {
    const result = EtfListQuerySchema.parse({})
    expect(result.sort).toBe('ticker')
  })

  it('defaults order to asc', () => {
    const result = EtfListQuerySchema.parse({})
    expect(result.order).toBe('asc')
  })

  it('accepts valid sort fields', () => {
    const fields = [
      'ter',
      'fundSizeEur',
      'inceptionDate',
      'ticker',
      'name',
    ] as const
    for (const sort of fields) {
      expect(() => EtfListQuerySchema.parse({ sort })).not.toThrow()
    }
  })

  it('rejects invalid sort field', () => {
    expect(() => EtfListQuerySchema.parse({ sort: 'price' })).toThrow()
  })

  it('rejects invalid order value', () => {
    expect(() => EtfListQuerySchema.parse({ order: 'random' })).toThrow()
  })
})
