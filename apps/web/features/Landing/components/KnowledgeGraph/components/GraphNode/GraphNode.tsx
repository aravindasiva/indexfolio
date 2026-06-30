import type { NodeType } from '@indexfolio/knowledge-graph'
import { NODE_COLORS } from '../../utils/graph'

export const NODE_BASE_RADIUS = 4

const PULSE_MULTIPLIER = 2

// The ETF-detail node's label is "ETF <ticker>", where the ticker fades out,
// swaps, and fades back in while the "ETF" prefix stays put.
type FadingLabel = { prefix: string; value: string; visible: boolean }

interface GraphNodeProps {
  label: string
  type: NodeType
  /** 0-1 opacity driven by hover/focus state in the parent */
  opacity: number
  isHome: boolean
  /** Used to stagger pulse animation timing */
  animationIndex: number
  /** True when this node has keyboard focus - shows SVG ring instead of browser outline */
  isFocused: boolean
  /** Renders a "prefix value" label where only the value fades on change. */
  fading?: FadingLabel
  /** Draws a dotted ring around the dot (marks the dynamic ETF-detail node). */
  outlined?: boolean
  onClick: () => void
  onPointerEnter: () => void
  onPointerLeave: () => void
  onFocus: () => void
  onBlur: () => void
}

export function GraphNode({
  label,
  type,
  opacity,
  isHome,
  animationIndex,
  isFocused,
  fading,
  outlined = false,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}: Readonly<GraphNodeProps>) {
  const color = NODE_COLORS[type]
  const radius = isHome ? NODE_BASE_RADIUS * 1.75 : NODE_BASE_RADIUS
  const pulseDuration = 2.4 + (animationIndex % 5) * 0.4
  const pulseDelay = (animationIndex % 7) * 0.6

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') onClick()
  }

  return (
    <g
      role="button"
      // The home node is a secret trigger, not a link, so don't announce it as
      // navigation (the sr-only nav is the real map for assistive tech).
      aria-label={isHome ? label : `Go to ${label}`}
      tabIndex={0}
      style={{
        cursor: 'pointer',
        opacity,
        outline: 'none',
        transition: 'opacity 0.2s ease',
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <circle
        r={radius * PULSE_MULTIPLIER}
        fill={color}
        style={{
          opacity: 0.07,
          animation: `indexfolio-pulse ${pulseDuration}s ease-in-out infinite`,
          animationDelay: `${pulseDelay}s`,
        }}
      />

      {/* Keyboard focus ring - replaces the browser default outline box */}
      {isFocused && (
        <circle
          r={radius + 9}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeOpacity={0.6}
          style={{ transition: 'opacity 0.15s ease' }}
        />
      )}

      {/* Dotted outline - marks the dynamic ETF-detail node */}
      {outlined && (
        <circle
          r={radius + 5}
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.55}
          strokeDasharray="2 3"
        />
      )}

      <circle r={radius} fill={color} filter={`url(#graph-glow-${type})`} />

      {fading ? (
        <text
          x={0}
          y={radius + 18}
          textAnchor="middle"
          fontSize={11}
          fontWeight={400}
          fill={color}
          opacity={0.9}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <tspan>{fading.prefix} </tspan>
          {/* Always occupies its width (tickers are 4 chars), so the prefix
              never shifts - only the value fades when it swaps. */}
          <tspan
            style={{
              fillOpacity: fading.visible ? 1 : 0,
              transition: 'fill-opacity 0.3s ease',
            }}
          >
            {fading.value}
          </tspan>
        </text>
      ) : (
        <text
          x={0}
          y={radius + 18}
          textAnchor="middle"
          fontSize={isHome ? 12 : 11}
          fontWeight={isHome ? 700 : 400}
          fill={color}
          opacity={0.9}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: isHome ? 'var(--font-display)' : 'var(--font-sans)',
          }}
        >
          {label}
        </text>
      )}
    </g>
  )
}
