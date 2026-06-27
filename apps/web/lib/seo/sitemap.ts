import type { MetadataRoute } from 'next'
import { getAllEtfs } from '@/lib/api'
import { SITE_URL } from '../constants'

// Static routes plus a row per ETF detail page (fetched from the API; resilient
// if it is empty or unreachable, e.g. production before the scraper runs).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/screener`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    const etfs = await getAllEtfs()
    for (const etf of etfs) {
      routes.push({
        url: `${SITE_URL}/etf/${etf.ticker}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch {
    // API empty/unreachable - ship the static routes only.
  }

  return routes
}
