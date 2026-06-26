import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.indexfolio.dev'

// Only list routes that actually exist. Add tool routes as they ship.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
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
}
