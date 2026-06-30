import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/*
  Frosted-glass content surface (panels, tables, cards). Pair with the
  AmbientBackground for the glass to have something to frost.
*/
export function Surface({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('glass-panel rounded-2xl', className)} {...props} />
}
