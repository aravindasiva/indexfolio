import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageContainer } from '@/containers/PageContainer/PageContainer'
import { Skeleton } from '@/components/ui/skeleton'
import { Screener } from '@/features/Screener/Screener'

export const metadata: Metadata = {
  title: 'ETF Screener',
  description:
    'Filter UCITS ETFs for EU investors by TER, domicile, exchange, accumulating vs distributing, fund size, and asset class.',
}

export default function ScreenerPage() {
  return (
    <PageContainer
      title="ETF Screener"
      subtitle="Filter UCITS ETFs by TER, domicile, type, and asset class."
    >
      {/* Screener reads filters from the URL (useSearchParams via nuqs), so it
          needs a Suspense boundary to be statically prerendered. */}
      <Suspense fallback={<ScreenerFallback />}>
        <Screener />
      </Suspense>
    </PageContainer>
  )
}

function ScreenerFallback() {
  return (
    <div className="space-y-2" aria-busy="true">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
