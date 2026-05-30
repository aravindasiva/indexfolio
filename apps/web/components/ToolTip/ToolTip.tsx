import { motion } from 'framer-motion'

type ToolTipPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left'

type AnchorRect = Pick<
  DOMRect,
  'top' | 'right' | 'bottom' | 'left' | 'width' | 'height'
>

interface ToolTipProps {
  text: string
  isVisible: boolean
  anchorRect: AnchorRect | null
  placement?: ToolTipPlacement
  offset?: number
  className?: string
}

interface PositionResult {
  top: number
  left: number
  placement: Exclude<ToolTipPlacement, 'auto'>
}

const VIEWPORT_MARGIN = 8
const EST_TOOLTIP_WIDTH = 180
const EST_TOOLTIP_HEIGHT = 36

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min
  if (value > max) return max
  return value
}

function resolveAutoPlacement(
  rect: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
): Exclude<ToolTipPlacement, 'auto'> {
  const spaceTop = rect.top
  const spaceRight = viewportWidth - rect.right
  const spaceBottom = viewportHeight - rect.bottom
  const spaceLeft = rect.left

  if (spaceTop >= EST_TOOLTIP_HEIGHT + 16) return 'top'
  if (spaceBottom >= EST_TOOLTIP_HEIGHT + 16) return 'bottom'
  if (spaceRight >= EST_TOOLTIP_WIDTH + 16) return 'right'
  return spaceLeft >= EST_TOOLTIP_WIDTH + 16 ? 'left' : 'top'
}

function resolvePosition(
  rect: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
  placement: ToolTipPlacement,
  offset: number,
): PositionResult {
  const side =
    placement === 'auto'
      ? resolveAutoPlacement(rect, viewportWidth, viewportHeight)
      : placement

  if (side === 'top') {
    return {
      top: rect.top - EST_TOOLTIP_HEIGHT - offset,
      left: clamp(
        rect.left + rect.width / 2 - EST_TOOLTIP_WIDTH / 2,
        VIEWPORT_MARGIN,
        viewportWidth - EST_TOOLTIP_WIDTH - VIEWPORT_MARGIN,
      ),
      placement: side,
    }
  }

  if (side === 'bottom') {
    return {
      top: rect.bottom + offset,
      left: clamp(
        rect.left + rect.width / 2 - EST_TOOLTIP_WIDTH / 2,
        VIEWPORT_MARGIN,
        viewportWidth - EST_TOOLTIP_WIDTH - VIEWPORT_MARGIN,
      ),
      placement: side,
    }
  }

  if (side === 'right') {
    return {
      top: clamp(
        rect.top + rect.height / 2 - EST_TOOLTIP_HEIGHT / 2,
        VIEWPORT_MARGIN,
        viewportHeight - EST_TOOLTIP_HEIGHT - VIEWPORT_MARGIN,
      ),
      left: rect.right + offset,
      placement: side,
    }
  }

  return {
    top: clamp(
      rect.top + rect.height / 2 - EST_TOOLTIP_HEIGHT / 2,
      VIEWPORT_MARGIN,
      viewportHeight - EST_TOOLTIP_HEIGHT - VIEWPORT_MARGIN,
    ),
    left: rect.left - EST_TOOLTIP_WIDTH - offset,
    placement: side,
  }
}

export function ToolTip({
  text,
  isVisible,
  anchorRect,
  placement = 'auto',
  offset = 14,
  className = '',
}: Readonly<ToolTipProps>) {
  const classes =
    'glass-tooltip pointer-events-none fixed z-50 max-w-[180px] rounded-lg px-3 py-1.5 text-center text-xs leading-tight'

  const hasWindow = globalThis.window !== undefined
  const viewportWidth = hasWindow ? globalThis.window.innerWidth : 1280
  const viewportHeight = hasWindow ? globalThis.window.innerHeight : 720
  const fallback = { top: -9999, left: -9999, placement: 'top' as const }
  const position = anchorRect
    ? resolvePosition(
        anchorRect as DOMRect,
        viewportWidth,
        viewportHeight,
        placement,
        offset,
      )
    : fallback

  return (
    <motion.span
      role="tooltip"
      aria-hidden={!isVisible}
      initial={false}
      animate={
        isVisible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 4, scale: 0.98 }
      }
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      style={{ top: position.top, left: position.left }}
      data-placement={position.placement}
      className={`${classes} ${className}`.trim()}
    >
      {text}
    </motion.span>
  )
}
