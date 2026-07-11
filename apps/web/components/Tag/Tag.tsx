import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Small coloured label for categorical data. Tones map to theme-aware semantic
// tokens (lighter in dark mode) so they stay legible everywhere.
export type TagTone = 'indigo' | 'amber' | 'emerald' | 'sky' | 'neutral'

const TONES: Record<TagTone, string> = {
  indigo: 'bg-primary/10 text-primary',
  amber: 'bg-warning/10 text-warning',
  emerald: 'bg-positive/10 text-positive',
  sky: 'bg-info/10 text-info',
  neutral:
    'bg-foreground/5 text-muted-foreground ring-1 ring-inset ring-border',
}

export function Tag({
  tone = 'neutral',
  children,
}: {
  tone?: TagTone
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        TONES[tone],
      )}
    >
      {children}
    </span>
  )
}
