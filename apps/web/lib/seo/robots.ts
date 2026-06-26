import type { MetadataRoute } from 'next'
import { SITE_URL } from '../constants'

// Only let crawlers index production. Staging/preview (and local) are disallowed
// so they never compete with the real site in search results.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production'

  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
