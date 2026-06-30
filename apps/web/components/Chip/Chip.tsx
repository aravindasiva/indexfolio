import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { tactile } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
  Small rounded interactive token in two modes: 'toggle' (default) is a
  selectable filter with an indigo active tint; 'removable' is an applied filter
  that clears itself, with an x that rotates on hover as a "this closes" cue.
*/
type ChipProps = { children: ReactNode } & (
  | { mode?: 'toggle'; active: boolean; onClick: () => void }
  | { mode: 'removable'; onRemove: () => void }
)

const BASE =
  'group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none'

export function Chip(props: ChipProps) {
  if (props.mode === 'removable') {
    return (
      <motion.button
        type="button"
        onClick={props.onRemove}
        {...tactile}
        className={cn(
          BASE,
          'border-border bg-muted/60 text-xs text-foreground hover:bg-muted',
        )}
      >
        {props.children}
        <X className="size-3 opacity-60 transition-transform duration-200 group-hover:rotate-90 group-hover:opacity-100" />
      </motion.button>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.active}
      {...tactile}
      className={cn(
        BASE,
        'text-sm',
        props.active
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-background/40 text-muted-foreground hover:border-foreground/25 hover:text-foreground',
      )}
    >
      {props.children}
    </motion.button>
  )
}
