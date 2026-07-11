import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

// A dashed "coming soon" badge for laid-out slots whose data has not landed yet.
export function ComingSoon({
  label = 'Coming soon',
  compact,
  className,
}: {
  label?: string
  compact?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-dashed border-warning/50 font-medium whitespace-nowrap text-warning',
        compact
          ? 'gap-1 px-2 py-0.5 text-[10px]'
          : 'gap-1.5 px-2.5 py-0.5 text-xs',
        className,
      )}
    >
      <Clock className={compact ? 'size-2.5' : 'size-3'} />
      {label}
    </span>
  )
}
