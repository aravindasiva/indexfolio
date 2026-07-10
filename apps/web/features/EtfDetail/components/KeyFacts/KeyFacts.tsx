import type { Etf } from '@/lib/api'
import { formatFundSize, formatTer } from '@/lib/etf/format'
import { domicileLabel } from '@/lib/etf/labels'

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-base font-semibold tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  )
}

// Plain label/value grid (no cards) so it reads as one block with the header
// surface it sits inside.
export function KeyFacts({ etf }: { etf: Etf }) {
  const facts = [
    { label: 'TER', value: formatTer(etf.ter) },
    { label: 'Fund size', value: formatFundSize(etf.fundSizeEur) },
    {
      label: 'Domicile',
      value: `${domicileLabel(etf.domicile)} (${etf.domicile})`,
    },
    {
      label: 'Type',
      value: etf.isAccumulating ? 'Accumulating' : 'Distributing',
    },
    {
      label: 'Inception',
      value: new Date(etf.inceptionDate).getFullYear().toString(),
    },
    { label: 'Index', value: etf.indexTracked },
  ]

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
      {facts.map((fact) => (
        <Fact key={fact.label} label={fact.label} value={fact.value} />
      ))}
    </dl>
  )
}
