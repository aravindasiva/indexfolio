import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Surface } from '@/components/Surface/Surface'
import { Tag } from '@/components/Tag/Tag'
import type { Etf } from '@/lib/api'
import { formatTer } from '@/lib/etf/format'
import { assetClassLabel, assetTone } from '@/lib/etf/labels'

// Similar funds (same index, then same asset class). Renders nothing when empty.
export function RelatedEtfs({ etfs }: { etfs: Etf[] }) {
  if (etfs.length === 0) return null

  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
        Related ETFs
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {etfs.map((etf) => (
          <Link
            key={etf.id}
            href={`/etf/${encodeURIComponent(etf.ticker)}`}
            className="group min-w-0 no-underline"
          >
            <Surface className="flex h-full flex-col p-4 transition-colors hover:border-primary/40">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">
                  {etf.ticker}
                </span>
                <Tag tone={assetTone(etf.assetClass)}>
                  {assetClassLabel(etf.assetClass)}
                </Tag>
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {etf.name}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm tabular-nums text-muted-foreground">
                  TER {formatTer(etf.ter)}
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Surface>
          </Link>
        ))}
      </div>
    </section>
  )
}
