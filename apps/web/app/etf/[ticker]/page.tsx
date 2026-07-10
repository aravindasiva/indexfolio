import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageContainer } from '@/containers/PageContainer/PageContainer'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { EtfDetail } from '@/features/EtfDetail/EtfDetail'
import { loadEtf, loadRelated } from '@/features/EtfDetail/utils/loader'
import { pageMetadata } from '@/lib/seo/metadata'
import { etfSchema } from '@/lib/seo/schema'
import { formatTer } from '@/lib/etf/format'
import { domicileLabel, providerLabel } from '@/lib/etf/labels'

// Rendered per request against the live API, so a newly-ingested ETF
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ ticker: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { ticker } = await params
  const etf = await loadEtf(ticker)
  if (!etf) return { title: 'ETF not found', robots: { index: false } }

  const type = etf.isAccumulating ? 'Accumulating' : 'Distributing'
  // No `image`: the co-located opengraph-image.tsx is applied via Next's file
  // convention (host-relative, resolves correctly in every environment).
  return pageMetadata({
    title: `${etf.name} (${etf.ticker})`,
    description: `${type} UCITS ETF tracking ${etf.indexTracked}. TER ${formatTer(etf.ter)}, ${domicileLabel(etf.domicile)}-domiciled. Key facts and costs for EU investors.`,
    path: `/etf/${encodeURIComponent(etf.ticker)}`,
  })
}

export default async function EtfPage({ params }: Params) {
  const { ticker } = await params
  const etf = await loadEtf(ticker)
  if (!etf) notFound()

  const related = await loadRelated(etf)

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'ETF Screener', href: '/screener' },
            { label: etf.ticker, href: `/etf/${etf.ticker}` },
          ]}
        />
      }
    >
      <JsonLd
        data={etfSchema({
          ticker: etf.ticker,
          name: etf.name,
          isin: etf.isin,
          provider: providerLabel(etf.provider),
        })}
      />
      <EtfDetail etf={etf} related={related} />
    </PageContainer>
  )
}
