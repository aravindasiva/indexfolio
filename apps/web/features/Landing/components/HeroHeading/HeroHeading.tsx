// Server-rendered so it paints before the graph: the page's LCP element and its <h1>.
// No fade-in - it must be visible at first paint to count as the LCP.
export function HeroHeading() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-28 sm:px-10 sm:pt-32 lg:pt-36">
      <div className="max-w-md lg:max-w-lg">
        <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-primary"
          />
          Open-source ETF toolkit
        </p>
        <h1 className="mt-5 text-balance font-display text-2xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          Open tools for European{' '}
          <span className="text-primary">index investors</span>
        </h1>
        <p className="mt-4 max-w-sm text-pretty text-sm text-muted-foreground sm:text-base">
          Screen UCITS ETFs, compare costs, and understand fund taxation.
        </p>
      </div>
    </div>
  )
}
