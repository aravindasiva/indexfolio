import { Sparkles } from 'lucide-react'
import type { Etf } from '@/lib/api'
import { Panel } from '@/components/Panel/Panel'
import { assetClassLabel } from '@/lib/etf/labels'
import { formatTer } from '@/lib/etf/format'

// Plain-language summary, built only from fields we have. Primary tint - first thing a beginner reads.
export function QuickTake({ etf }: { etf: Etf }) {
  const dividends = etf.isAccumulating
    ? 'reinvested automatically'
    : 'paid out to you as cash'
  return (
    <Panel tone="primary" icon={<Sparkles />}>
      <p className="text-sm text-foreground sm:text-[15px]">
        {assetClassLabel(etf.assetClass)} ETF tracking the{' '}
        <span className="font-semibold">{etf.indexTracked}</span>. Dividends are{' '}
        {dividends}, and it costs {formatTer(etf.ter)} per year.
      </p>
    </Panel>
  )
}
