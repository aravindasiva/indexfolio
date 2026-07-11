import { Landmark } from 'lucide-react'
import type { Etf } from '@/lib/api'
import { Panel } from '@/components/Panel/Panel'
import { DOMICILE_HINT, TYPE_HINT } from '@/lib/etf/labels'

// Tax note in the positive-toned callout; the domicile hint is IE-specific.
export function GoodToKnow({ etf }: { etf: Etf }) {
  return (
    <Panel tone="positive" icon={<Landmark />} title="Good to know · tax">
      <div className="space-y-2 text-xs text-muted-foreground">
        {etf.domicile === 'IE' && <p>{DOMICILE_HINT}</p>}
        <p>{TYPE_HINT}</p>
      </div>
    </Panel>
  )
}
