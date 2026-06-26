import type { MetadataRoute } from 'next'
import { SITE_URL } from '../constants'

// Only list routes that actually exist. Add tool routes as they ship
// (ETF detail pages get enumerated here in the detail-page PR).
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
