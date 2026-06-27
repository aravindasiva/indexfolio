import type { Metadata } from 'next'
// Relative import (test graph; vitest resolves relative paths only).
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../constants'

const DEFAULT_TITLE = `${SITE_NAME} - Free tools for EU passive investors`

// Site-wide metadata (the root layout exports this). The title template frames
// child titles, e.g. "ETF Screener · Indexfolio".
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
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

// Per-page metadata in one call: title, description, canonical, and OG/Twitter.
//
// We deliberately do NOT set an `images` field by default. Next's file-convention
// opengraph-image.tsx already cascades the right image to every route (the root
// app/opengraph-image for most pages, a route's own for those that have one) and
// resolves it against the *current* host - so it works in dev, preview, and prod.
// Hand-setting a path here resolves against metadataBase (the prod domain), which
// breaks everywhere but prod, so only pass `image` for a genuinely custom OG
// image. `path` is site-root relative. 1200x630 matches OG_SIZE in og.tsx.
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
