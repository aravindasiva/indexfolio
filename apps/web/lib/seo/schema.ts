// Relative import (test graph; vitest resolves relative paths only).
import {
  SITE_DESCRIPTION,
  SITE_GITHUB,
  SITE_NAME,
  SITE_URL,
} from '../constants'

// schema.org JSON-LD builders (pure; serialised by <JsonLd>).
export type JsonLd = Record<string, unknown>

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    sameAs: [SITE_GITHUB],
  }
}

// Site + a SearchAction (enables a sitelinks search box landing on the screener).
export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/screener?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// A single ETF as a schema.org FinancialProduct (closest fit for a fund).
// `provider` is the display name; the caller formats it.
export function etfSchema(etf: {
  ticker: string
  name: string
  isin: string
  provider: string
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: etf.name,
    url: `${SITE_URL}/etf/${etf.ticker}`,
    category: 'ETF',
    identifier: etf.isin,
    provider: { '@type': 'Organization', name: etf.provider },
  }
}

export type BreadcrumbItem = { name: string; url: string }

// An ordered trail (absolute URLs) for BreadcrumbList rich results.
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
