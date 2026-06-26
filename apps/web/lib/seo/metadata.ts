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

// Per-page metadata in one call: title, description, canonical, and OG block.
// Every content route should use this for consistent SEO. `path` is site-root
// relative (resolved against metadataBase).
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en',
      url: path,
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}
