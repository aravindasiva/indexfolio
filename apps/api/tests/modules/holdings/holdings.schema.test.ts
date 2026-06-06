import { describe, expect, it } from 'vitest'
import { HoldingsQuerySchema } from '../../../src/modules/holdings/holdings.schema.js'

describe('HoldingsQuerySchema', () => {
  it('parses a valid query with etfId only', () => {
    expect(HoldingsQuerySchema.parse({ etfId: 'abc123' })).toEqual({
      etfId: 'abc123',
    })
  })

  it('parses a query with an ISO datetime asOfDate', () => {
    const result = HoldingsQuerySchema.parse({
      etfId: 'abc123',
      asOfDate: '2024-01-01T00:00:00.000Z',
    })
    expect(result.asOfDate).toBe('2024-01-01T00:00:00.000Z')
  })

  it('rejects an empty etfId', () => {
    expect(() => HoldingsQuerySchema.parse({ etfId: '' })).toThrow()
  })
})
