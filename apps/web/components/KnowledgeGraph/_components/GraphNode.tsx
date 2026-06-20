import type { NodeType } from '@indexfolio/knowledge-graph'
import { NODE_COLORS } from '../_lib/graph'

export const NODE_BASE_RADIUS = 4

const PULSE_MULTIPLIER = 2

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
      aria-label={`Go to ${label}`}
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
      {/* Pulse halo */}
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

      {/* Core dot */}
      <circle r={radius} fill={color} filter={`url(#graph-glow-${type})`} />

      {/* Label - centred below the node dot */}
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
    </g>
  )
}
