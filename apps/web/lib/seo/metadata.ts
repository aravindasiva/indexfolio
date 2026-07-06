import type { Metadata } from 'next'
// Relative import (test graph; vitest resolves relative paths only).
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../constants'

const DEFAULT_TITLE = `${SITE_NAME} - Free tools for EU passive investors`

// Site-wide metadata. The title template frames child titles, e.g.
// "ETF Screener · Indexfolio".
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/indexfolio.png', type: 'image/png', sizes: '192x192' }],
    apple: '/indexfolio.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
}

// Per-page metadata. We deliberately do NOT set `images` by default: Next's
// opengraph-image.tsx cascades the right image to every route and resolves it
// against the current host, so it works in dev, preview, and prod. Hand-setting a
// path resolves against metadataBase (prod domain) and breaks everywhere else, so
// only pass `image` for a genuinely custom OG image. 1200x630 matches OG_SIZE.
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  const openGraph: Metadata['openGraph'] = {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en',
    url: path,
    title,
    description,
  }
  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
  }

  if (image) {
    openGraph.images = [{ url: image, width: 1200, height: 630, alt: title }]
    twitter.images = [image]
  }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph,
    twitter,
  }
}
