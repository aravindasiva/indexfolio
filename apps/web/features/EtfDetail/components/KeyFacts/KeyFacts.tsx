import { Lightbulb } from 'lucide-react'
import type { Etf } from '@/lib/api'
import { Panel } from '@/components/Panel/Panel'
import { formatFundSize, formatTer } from '@/lib/etf/format'
import { domicileLabel } from '@/lib/etf/labels'

// The two numbers that drive a passive investor's choice, pulled up as headline stats.
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-foreground">
        {value}
      </p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  )
}

export function KeyFacts({ etf }: { etf: Etf }) {
  const rows = [
    {
      label: 'Domicile',
      value: `${domicileLabel(etf.domicile)} (${etf.domicile})`,
    },
    {
      label: 'Type',
      value: etf.isAccumulating ? 'Accumulating' : 'Distributing',
    },
    { label: 'Index', value: etf.indexTracked },
    {
      label: 'Inception',
      value: new Date(etf.inceptionDate).getFullYear().toString(),
    },
  ]

  return (
    <Panel
      tone="neutral"
      chipClassName="text-primary"
      icon={<Lightbulb />}
      title="Key facts"
    >
      <div className="grid grid-cols-2 gap-4">
        <Stat label="Annual cost" value={formatTer(etf.ter)} />
        <Stat label="Fund size" value={formatFundSize(etf.fundSizeEur)} />
      </div>
      <dl className="mt-4 border-t border-border pt-1">
        {rows.map((row) => (
          <Row key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
    </Panel>
  )
}
