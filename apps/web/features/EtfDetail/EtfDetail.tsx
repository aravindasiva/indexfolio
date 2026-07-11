import { PieChart, TrendingUp } from 'lucide-react'
import { Reveal } from '@/components/Reveal/Reveal'
import { CatTap } from '@/components/CatTap/CatTap'
import { Tag } from '@/components/Tag/Tag'
import { CopyButton } from '@/components/CopyButton/CopyButton'
import type { Etf, EtfDetail } from '@/lib/api'
import {
  assetClassLabel,
  assetTone,
  domicileLabel,
  providerLabel,
} from '@/lib/etf/labels'
import { BackToResults } from './components/BackToResults/BackToResults'
import { KeyFacts } from './components/KeyFacts/KeyFacts'
import { QuickTake } from './components/QuickTake/QuickTake'
import { WhereToBuy } from './components/WhereToBuy/WhereToBuy'
import { Placeholder } from './components/Placeholder/Placeholder'
import { GoodToKnow } from './components/GoodToKnow/GoodToKnow'
import { RelatedEtfs } from './components/RelatedEtfs/RelatedEtfs'

/*
  Fully server-rendered (BackButton + CopyButton are the only client islands). The story runs down
  the left; key facts + tax pin to the right. Prices and holdings are laid-out slots that say
  "coming soon" until their scrapers land. Every card is a Panel so the page reads as one system.
*/
export function EtfDetail({
  etf,
  related,
}: {
  etf: EtfDetail
  related: Etf[]
}) {
  return (
    <Reveal className="space-y-6">
      <BackToResults />
      <DetailHero etf={etf} />
      <QuickTake etf={etf} />

      <div className="grid grid-cols-1 items-start gap-x-6 gap-y-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <WhereToBuy
            listings={etf.listings}
            matchedTicker={etf.matchedTicker}
          />
          <Placeholder icon={<TrendingUp />} title="Performance">
            The latest quote, daily move, and a 1M / 1Y / 5Y / Max return chart
            land with the price data.
          </Placeholder>
          <Placeholder icon={<PieChart />} title="Holdings">
            Top holdings, and the split by sector, region and country, land with
            the holdings data.
          </Placeholder>
        </div>

        <aside className="order-first space-y-4 lg:order-0 lg:sticky lg:top-6">
          <KeyFacts etf={etf} />
          <GoodToKnow etf={etf} />
        </aside>
      </div>

      <RelatedEtfs etfs={related} />
    </Reveal>
  )
}

function DetailHero({ etf }: { etf: Etf }) {
  return (
    <div className="border-b border-border pb-6">
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
        <CatTap className="font-semibold text-foreground">{etf.ticker}</CatTap>
        {` · ${providerLabel(etf.provider)} · ${domicileLabel(etf.domicile)} (${etf.domicile})`}
      </p>
    </div>
  )
}
