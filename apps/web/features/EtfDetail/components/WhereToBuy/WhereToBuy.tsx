import { Store } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Panel } from '@/components/Panel/Panel'
import { ComingSoon } from '@/components/ComingSoon/ComingSoon'
import type { Listing } from '@/lib/api'
import { cn } from '@/lib/utils'

const HEAD =
  'h-9 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase'

// Compare every venue at a glance; the row the visitor arrived on (matchedTicker) is highlighted.
// Price is the prepared slot - a "Soon" badge until per-venue prices land.
function VenueTable({
  listings,
  matchedTicker,
}: {
  listings: Listing[]
  matchedTicker: string
}) {
  const matchedIndex = listings.findIndex((l) => l.ticker === matchedTicker)
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={HEAD}>Exchange</TableHead>
          <TableHead className={HEAD}>Ticker</TableHead>
          <TableHead className={HEAD}>Currency</TableHead>
          <TableHead className={cn(HEAD, 'text-right')}>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map((listing, i) => {
          const matched = i === matchedIndex
          return (
            <TableRow
              key={`${listing.exchange}-${listing.ticker}-${listing.currency}`}
              className={cn(matched && 'bg-primary/6 hover:bg-primary/9')}
            >
              <TableCell className="px-3 py-3.5 font-medium text-foreground">
                {listing.exchange}
                {matched && (
                  <span className="ml-2 rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Your ticker
                  </span>
                )}
              </TableCell>
              <TableCell className="px-3 py-3.5 font-mono text-muted-foreground">
                {listing.ticker}
              </TableCell>
              <TableCell className="px-3 py-3.5 font-mono text-muted-foreground">
                {listing.currency}
              </TableCell>
              <TableCell className="px-3 py-3.5 text-right">
                <ComingSoon label="Soon" compact />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function WhereToBuy({
  listings,
  matchedTicker,
}: {
  listings: Listing[]
  matchedTicker: string
}) {
  const many = listings.length > 1
  return (
    <Panel
      tone="neutral"
      icon={<Store />}
      title="Where to buy"
      subtitle={
        many
          ? `Trades on ${listings.length} exchanges - your ticker is highlighted`
          : 'Trades on one exchange'
      }
    >
      <VenueTable listings={listings} matchedTicker={matchedTicker} />
    </Panel>
  )
}
