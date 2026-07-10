import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCw } from 'lucide-react'
import { AmbientBackground } from '@/components/AmbientBackground/AmbientBackground'
import { springSoft, tactile } from '@/lib/motion'

const MotionLink = motion.create(Link)

export type ErrorPageProps = {
  reset: () => void
}

// `reset` retries the segment; the link is the escape hatch.
export function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center">
      <AmbientBackground />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSoft}
      >
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Something broke
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          A node came loose.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
          An unexpected error interrupted this page. Try again, or head back to
          the graph.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            type="button"
            onClick={reset}
            {...tactile}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            <RotateCw size={16} />
            Try again
          </motion.button>
          <MotionLink
            href="/"
            {...tactile}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground no-underline transition hover:bg-muted"
          >
            <ArrowLeft size={16} />
            Back home
          </MotionLink>
        </div>
      </motion.div>
    </main>
  )
}
