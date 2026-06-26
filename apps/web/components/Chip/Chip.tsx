import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { tactile } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
  A reusable toggle chip (single- or multi-select). Idle chips are quiet; the
  active state is a clear indigo tint so a glance shows what is applied. The
  shared `tactile` preset gives it a small lift on hover and a squash on press,
  so it feels the same as every other clickable surface in the app.
*/
export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      {...tactile}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
        active
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-background/40 text-muted-foreground hover:border-foreground/25 hover:text-foreground',
      )}
    >
      {children}
    </motion.button>
  )
}
