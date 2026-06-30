import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og'

export const alt = 'Indexfolio ETF Screener'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: 'ETF Screener',
    title: 'Screen UCITS ETFs',
    subtitle: 'Filter by TER, domicile, type, fund size, and asset class.',
  })
}
