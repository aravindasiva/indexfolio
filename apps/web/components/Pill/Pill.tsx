import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { tactile } from '@/lib/motion'

/*
  A removable pill, e.g. an applied filter. Clicking it (or its x) removes it.
  Carries the shared `tactile` lift/press so removing a filter feels physical,
  and the x rotates on hover as a small "yes, this closes" cue.
*/
export function Pill({
  onRemove,
  children,
}: {
  onRemove: () => void
  children: ReactNode
}) {
  return (
    <motion.button
      type="button"
      onClick={onRemove}
      {...tactile}
      className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
    >
      {children}
      <X className="size-3 opacity-60 transition-transform duration-200 group-hover:rotate-90 group-hover:opacity-100" />
    </motion.button>
  )
}
