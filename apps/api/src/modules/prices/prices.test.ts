import { describe, expect, it } from 'vitest'
import { PricesQuerySchema } from './prices.schema.js'

describe('PricesQuerySchema', () => {
  it('parses a valid query with etfId only', () => {
    expect(PricesQuerySchema.parse({ etfId: 'abc123' })).toEqual({
      etfId: 'abc123',
    })
  })

  it('parses a query with date range', () => {
    const result = PricesQuerySchema.parse({
      etfId: 'abc123',
      from: '2024-01-01T00:00:00.000Z',
      to: '2024-12-31T00:00:00.000Z',
    })
    expect(result.from).toBeDefined()
    expect(result.to).toBeDefined()
  })

  it('rejects an empty etfId', () => {
    expect(() => PricesQuerySchema.parse({ etfId: '' })).toThrow()
  })
})
