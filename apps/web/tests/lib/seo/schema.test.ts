import { describe, expect, it } from 'vitest'
import {
  breadcrumbSchema,
  organizationSchema,
  websiteSchema,
} from '../../../lib/seo/schema'

describe('organizationSchema', () => {
  it('is a schema.org Organization linking the GitHub repo', () => {
    const schema = organizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['sameAs']).toContain(
      'https://github.com/aravindasiva/indexfolio',
    )
  })
})

describe('websiteSchema', () => {
  it('exposes a SearchAction pointing at the screener', () => {
    const schema = websiteSchema()
    expect(schema['@type']).toBe('WebSite')
    const action = schema['potentialAction'] as Record<string, unknown>
    expect(action['@type']).toBe('SearchAction')
    const target = action['target'] as Record<string, unknown>
    expect(target['urlTemplate']).toContain(
      '/screener?search={search_term_string}',
    )
  })
})

describe('breadcrumbSchema', () => {
  it('numbers items from 1 and keeps name + url', () => {
    const schema = breadcrumbSchema([
      { name: 'Home', url: 'https://www.indexfolio.dev' },
      { name: 'Screener', url: 'https://www.indexfolio.dev/screener' },
    ])
    expect(schema['@type']).toBe('BreadcrumbList')
    const items = schema['itemListElement'] as Array<Record<string, unknown>>
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({
      position: 1,
      name: 'Home',
      item: 'https://www.indexfolio.dev',
    })
    expect(items[1]).toMatchObject({ position: 2, name: 'Screener' })
  })
})
