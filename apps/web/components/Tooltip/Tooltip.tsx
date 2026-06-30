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
  Wrapper over the Base UI tooltip primitives. Pass a single interactive element
  as children; Base UI's render prop merges trigger behaviour onto it, so handlers
  stay on the real control with no extra wrapper to trip accessibility checks.
*/
export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <TooltipRoot>
      <TooltipTrigger render={children} />
      <TooltipContent side={side}>{content}</TooltipContent>
    </TooltipRoot>
  )
}
