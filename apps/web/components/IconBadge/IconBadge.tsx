import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type IconBadgeSize = 'sm' | 'md' | 'lg'
type IconBadgeVariant = 'soft' | 'outline' | 'ghost'

// Box and inner lucide icon sizes move together, so the icon stays centred and proportional.
const SIZE: Record<IconBadgeSize, string> = {
  sm: 'size-7 [&_svg]:size-3.5',
  md: 'size-8 [&_svg]:size-4',
  lg: 'size-10 [&_svg]:size-5',
}

// Colour comes from the text colour you pass (e.g. text-primary): the icon is currentColor and the
// soft fill / outline derive from it, so one class themes the whole badge.
const VARIANT: Record<IconBadgeVariant, string> = {
  soft: 'bg-current/15',
  outline: 'border border-current/30',
  ghost: '',
}

/*
  A lucide icon in an optional decorative box. `soft` is a filled chip, `outline` a bordered box,
  `ghost` just the icon. Pass any text-* colour to theme it. Reused for panel headers, empty states,
  list markers, etc.
*/
export function IconBadge({
  variant = 'soft',
  size = 'md',
  className,
  children,
}: {
  variant?: IconBadgeVariant
  size?: IconBadgeSize
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-lg',
        SIZE[size],
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
