import { describe, expect, it } from 'vitest'
import { pageMetadata } from '../../../lib/seo/metadata'

describe('pageMetadata', () => {
  it('sets title, description, canonical, and a matching OG block', () => {
    const meta = pageMetadata({
      title: 'ETF Screener',
      description: 'Filter UCITS ETFs.',
      path: '/screener',
    })

    expect(meta.title).toBe('ETF Screener')
    expect(meta.description).toBe('Filter UCITS ETFs.')
    expect(meta.alternates?.canonical).toBe('/screener')
    expect(meta.openGraph?.url).toBe('/screener')
    expect(meta.openGraph?.title).toBe('ETF Screener')
  })
})
