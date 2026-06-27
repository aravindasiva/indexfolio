import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/seo/og'
import { getEtfByTicker } from '@/lib/api'
import { formatTer, fundTypeLabel } from '@/lib/etf/format'
import { assetClassLabel, domicileLabel } from '@/lib/etf/labels'

// Per-ETF share card: ticker as the hook, name + key facts beneath.
export const alt = 'Indexfolio ETF'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

type Params = { params: Promise<{ ticker: string }> }

export default async function Image({ params }: Params) {
  const { ticker } = await params
  try {
    const etf = await getEtfByTicker(ticker, { revalidate: 3600 })
    return renderOgImage({
      eyebrow: `${assetClassLabel(etf.assetClass)} · ${domicileLabel(etf.domicile)}`,
      title: etf.ticker,
      subtitle: `${etf.name} · ${fundTypeLabel(etf.isAccumulating)} · TER ${formatTer(etf.ter)}`,
    })
  } catch {
    return renderOgImage({
      title: 'ETF',
      subtitle: 'Free tools for EU passive investors',
    })
  }
}
