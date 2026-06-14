'use client'

import type { ReactElement, ReactNode } from 'react'
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

type TooltipProps = {
  content: ReactNode
  children: ReactElement
  side?: TooltipSide
}

/*
  Convenience wrapper over the Base UI tooltip primitives.

  Pass any single interactive element as children. Base UI's render prop merges
  the trigger behaviour onto that native element, so all handlers stay on the
  real control - no extra interactive wrapper to trip accessibility checks.
*/
export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <TooltipRoot>
      <TooltipTrigger render={children} />
      <TooltipContent side={side}>{content}</TooltipContent>
    </TooltipRoot>
  )
}
