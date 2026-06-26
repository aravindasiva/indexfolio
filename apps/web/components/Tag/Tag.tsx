import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/*
  A small coloured label for categorical data (asset class, fund type, etc.).
  Tones map to the theme's semantic tokens, which are theme-aware (lighter in
  dark mode) so they stay legible everywhere.
*/
export type TagTone = 'indigo' | 'amber' | 'emerald' | 'sky' | 'neutral'

const TONES: Record<TagTone, string> = {
  indigo: 'bg-primary/10 text-primary',
  amber: 'bg-warning/10 text-warning',
  emerald: 'bg-positive/10 text-positive',
  sky: 'bg-info/10 text-info',
  neutral: 'bg-muted text-muted-foreground',
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
