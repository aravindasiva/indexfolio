import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og'

// Default OG image for every page (routes can override with their own).
export const alt = 'Indexfolio - open-source tools for EU passive investors'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    title: 'Open-source tools for EU passive investors',
    subtitle: 'Screen UCITS ETFs, compare costs, and understand fund taxation.',
  })
}
