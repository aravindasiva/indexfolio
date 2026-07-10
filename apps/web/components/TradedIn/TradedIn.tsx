import { cn } from '@/lib/utils'

export type TradedInProps = {
  currencies: readonly string[]
  exchangeCount: number
  active?: readonly string[]
  className?: string
}

// A fund's currencies (the filtered one lit, overflow as +N) plus a separate venue count, so "+1"
// and "5 venues" never read as one number.
export function TradedIn({
  currencies,
  exchangeCount,
  active = [],
  className,
}: TradedInProps) {
  // Sort the filtered currency into the visible slice so it is never hidden in +N.
  const ordered = active.length
    ? [...currencies].sort(
        (a, b) => Number(active.includes(b)) - Number(active.includes(a)),
      )
    : currencies
  const shown = ordered.slice(0, 3)
  const extra = currencies.length - shown.length
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="inline-flex items-center gap-1.5">
        {shown.map((currency) => (
          <span
            key={currency}
            className={cn(
              'font-mono text-[11px]',
              active.includes(currency)
                ? 'font-bold text-primary'
                : 'text-muted-foreground',
            )}
          >
            {currency}
          </span>
        ))}
        {extra > 0 && (
          <span className="rounded-full border border-border px-1.5 font-mono text-[10px] text-muted-foreground">
            +{extra}
          </span>
        )}
      </span>
      <span className="whitespace-nowrap text-[11px] text-muted-foreground">
        ◇ {exchangeCount} {exchangeCount === 1 ? 'venue' : 'venues'}
      </span>
    </div>
  )
}
