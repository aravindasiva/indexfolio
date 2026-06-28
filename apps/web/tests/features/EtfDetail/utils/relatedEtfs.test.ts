import { describe, expect, it } from 'vitest'
import { selectRelated } from '../../../../features/EtfDetail/utils/relatedEtfs'

const etf = (ticker: string, indexTracked: string) => ({ ticker, indexTracked })

describe('selectRelated', () => {
  const current = etf('IWDA', 'MSCI World')
  const pool = [
    etf('IWDA', 'MSCI World'), // self
    etf('XDWD', 'MSCI World'), // same index
    etf('SWDA', 'MSCI World'), // same index
    etf('VWCE', 'FTSE All-World'), // same class, other index
    etf('EIMI', 'MSCI Emerging Markets'),
  ]

  it('excludes the current ETF', () => {
    const result = selectRelated(current, pool, 10)
    expect(result.map((e) => e.ticker)).not.toContain('IWDA')
  })

  it('puts same-index funds first, then others', () => {
    const result = selectRelated(current, pool, 10)
    expect(result.map((e) => e.ticker)).toEqual([
      'XDWD',
      'SWDA',
      'VWCE',
      'EIMI',
    ])
  })

  it('caps at the limit', () => {
    expect(selectRelated(current, pool, 2)).toHaveLength(2)
  })

  it('returns empty when the pool has only the current ETF', () => {
    expect(selectRelated(current, [etf('IWDA', 'MSCI World')], 6)).toEqual([])
  })
})
