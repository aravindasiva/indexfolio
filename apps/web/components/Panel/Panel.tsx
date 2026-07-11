import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { IconBadge } from '@/components/IconBadge/IconBadge'

type PanelTone = 'neutral' | 'primary' | 'positive'

const TONE: Record<PanelTone, string> = {
  neutral: 'glass-panel',
  primary: 'callout-primary',
  positive: 'callout-positive',
}

// The chip colour follows the tone; pass chipClassName to override (e.g. a primary chip on a neutral
// card to draw the eye).
const CHIP_TONE: Record<PanelTone, string> = {
  neutral: 'text-muted-foreground',
  primary: 'text-primary',
  positive: 'text-positive',
}

/*
  The one card pattern for the app: an icon chip + title header over a body, with a tone. `neutral`
  is the frosted glass surface; `primary`/`positive` are attention callouts (quick take, tax note).
  With no title it lays the icon beside the body inline (the quick-take shape).
*/
export function Panel({
  tone = 'neutral',
  icon,
  chipClassName,
  title,
  subtitle,
  action,
  className,
  children,
}: {
  tone?: PanelTone
  icon?: ReactNode
  chipClassName?: string
  title?: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  const container = cn('rounded-2xl p-5', TONE[tone], className)
  const chip = icon && (
    <IconBadge className={cn(CHIP_TONE[tone], chipClassName)}>{icon}</IconBadge>
  )

  if (!title) {
    return (
      <div className={container}>
        <div className="flex items-center gap-3">
          {chip}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={container}>
      <div className="flex items-center gap-2.5">
        {chip}
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}
