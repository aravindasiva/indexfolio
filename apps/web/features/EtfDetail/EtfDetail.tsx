import { Surface } from '@/components/Surface/Surface'
import { Tag } from '@/components/Tag/Tag'
import { CopyButton } from '@/components/CopyButton/CopyButton'
import type { Etf, EtfDetail } from '@/lib/api'
import {
  assetClassLabel,
  assetTone,
  domicileLabel,
  DOMICILE_HINT,
  providerLabel,
  TYPE_HINT,
} from '@/lib/etf/labels'
import { BackToResults } from './components/BackToResults/BackToResults'
import { KeyFacts } from './components/KeyFacts/KeyFacts'
import { Listings } from './components/Listings/Listings'
import { RelatedEtfs } from './components/RelatedEtfs/RelatedEtfs'

/*
  Server-rendered; only BackButton and CopyButton are client islands. The
  performance section is a placeholder until the scrapers land.
*/
export function EtfDetail({
  etf,
  related,
}: {
  etf: EtfDetail
  related: Etf[]
}) {
  return (
    <div className="space-y-8">
      <BackToResults />

      <Surface className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone={assetTone(etf.assetClass)}>
            {assetClassLabel(etf.assetClass)}
          </Tag>
          <Tag tone={etf.isAccumulating ? 'emerald' : 'sky'}>
            {etf.isAccumulating ? 'Accumulating' : 'Distributing'}
          </Tag>
          {etf.isUcits && <Tag tone="neutral">UCITS</Tag>}
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-foreground/4 px-2 py-0.5 text-xs">
            <span className="font-mono text-foreground">{etf.isin}</span>
            <CopyButton
              value={etf.isin}
              label={`Copy ISIN ${etf.isin}`}
              size="sm"
            />
          </span>
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {etf.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          <span className="font-semibold text-foreground">{etf.ticker}</span>
          {` · ${providerLabel(etf.provider)} · ${domicileLabel(etf.domicile)} (${etf.domicile})`}
        </p>

        <div className="my-6 border-t border-border/60" />

        <KeyFacts etf={etf} />
      </Surface>

      <Surface className="p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Where to buy
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {etf.listings.length === 1
            ? 'Trades on one exchange.'
            : `Trades on ${etf.listings.length} exchanges - pick a venue.`}
        </p>
        <div className="mt-4">
          <Listings listings={etf.listings} matchedTicker={etf.matchedTicker} />
        </div>
      </Surface>

      <Surface className="p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Performance
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Price and return history is on the way.
        </p>
      </Surface>

      <Surface className="p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Tax and domicile
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{DOMICILE_HINT}</p>
        <p className="mt-2 text-sm text-muted-foreground">{TYPE_HINT}</p>
      </Surface>

      <RelatedEtfs etfs={related} />
    </div>
  )
}
