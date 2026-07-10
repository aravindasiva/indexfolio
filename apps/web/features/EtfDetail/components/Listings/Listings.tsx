'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import type { Listing } from '@/lib/api'

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd
        className={`mt-1 text-base font-semibold text-foreground ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}

// Pick a venue; the panel below shows that listing's ticker/exchange/currency. Pre-selected to the
// ticker the visitor arrived on (matchedTicker). Fund-level facts stay put in KeyFacts; only the
// listing-level data swaps here - which is where price will slot in per venue.
export function Listings({
  listings,
  matchedTicker,
}: {
  listings: Listing[]
  matchedTicker: string
}) {
  const matched = listings.findIndex((l) => l.ticker === matchedTicker)
  const [active, setActive] = useState(Math.max(matched, 0))
  const selected = listings[active] ?? listings[0]
  if (!selected) return null

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {listings.map((listing, i) => {
          const isActive = i === active
          return (
            <button
              key={`${listing.exchange}-${listing.ticker}-${listing.currency}`}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(i)}
              className={`flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                isActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span className="text-sm font-medium text-foreground">
                {listing.exchange}
              </span>
              <span
                className={`font-mono text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {listing.ticker} · {listing.currency}
              </span>
            </button>
          )
        })}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-border bg-foreground/2 p-4 sm:grid-cols-4">
        <Field label="Ticker" value={selected.ticker} mono />
        <Field label="Exchange" value={selected.exchange} />
        <Field label="Currency" value={selected.currency} mono />
        <div>
          <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Price
          </dt>
          <dd className="mt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-warning/50 px-2.5 py-0.5 text-xs font-medium text-warning">
              <Clock className="size-3" />
              Coming soon
            </span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
