import type { Metadata } from 'next'
import { PageContainer } from '@/containers/PageContainer/PageContainer'
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
      <Screener />
    </PageContainer>
  )
}
