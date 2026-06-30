import { AmbientBackground } from '@/components/AmbientBackground/AmbientBackground'
import { BackButton } from '@/components/BackButton/BackButton'

export default function EtfNotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center">
      <AmbientBackground />
      <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
        404 · not found
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        This ETF isn&apos;t in our index.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
        The ticker may be wrong, or this fund isn&apos;t covered yet.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <BackButton
          to="/screener"
          label="Browse the screener"
          variant="solid"
          icon={null}
        />
        <BackButton label="Go back" variant="outline" />
      </div>
    </main>
  )
}
