import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/*
  Frosted-glass content surface (panels, tables, cards). The .glass-panel utility
  frosts the ambient background blobs behind it while keeping a ~62% card tint so
  text stays legible. Pair with the AmbientBackground for the glass to read.
*/
export function Surface({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('glass-panel rounded-2xl', className)} {...props} />
}
