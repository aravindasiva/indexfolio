import { describe, expect, it } from 'vitest'
import { EtfParamsSchema, EtfListQuerySchema } from './etf.schema.js'

describe('EtfParamsSchema', () => {
  it('parses a valid ticker', () => {
    expect(EtfParamsSchema.parse({ ticker: 'VWCE' })).toEqual({
      ticker: 'VWCE',
    })
  })

  it('rejects an empty ticker', () => {
    expect(() => EtfParamsSchema.parse({ ticker: '' })).toThrow()
  })
})

describe('EtfListQuerySchema', () => {
  it('applies default pagination values', () => {
    const result = EtfListQuerySchema.parse({})
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(20)
  })

  it('rejects a pageSize above the limit', () => {
    expect(() => EtfListQuerySchema.parse({ pageSize: 101 })).toThrow()
  })
})
