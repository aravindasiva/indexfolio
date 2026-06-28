'use client'

import type { ComponentType } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { tactile } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Variant = 'solid' | 'outline' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  solid:
    'rounded-full bg-primary px-6 py-3 text-primary-foreground hover:brightness-110',
  outline:
    'rounded-full border border-border px-6 py-3 text-foreground hover:bg-muted',
  ghost: 'text-muted-foreground hover:text-foreground',
}

const MotionLink = motion.create(Link)

/*
  A reusable navigation button. With a string `to` it is a real link (prefetched);
  with a function `to` it resolves the path on click (e.g. a value read from
  sessionStorage); with no `to` it goes to the previous page. Pass `icon={null}`
  for no icon.
*/
export function BackButton({
  to,
  label = 'Back',
  variant = 'ghost',
  icon: Icon = ArrowLeft,
}: {
  to?: string | (() => string)
  label?: string
  variant?: Variant
  icon?: ComponentType<{ className?: string }> | null
}) {
  const router = useRouter()
  const className = cn(
    'inline-flex items-center gap-1.5 text-sm font-medium no-underline transition',
    VARIANTS[variant],
  )
  const content = (
    <>
      {Icon ? <Icon className="size-4" /> : null}
      {label}
    </>
  )

  if (typeof to === 'string') {
    return (
      <MotionLink href={to} {...tactile} className={className}>
        {content}
      </MotionLink>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={() => (to ? router.push(to()) : globalThis.history.back())}
      {...tactile}
      className={className}
    >
      {content}
    </motion.button>
  )
}
