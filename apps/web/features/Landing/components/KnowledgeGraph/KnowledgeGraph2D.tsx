import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { NodeType } from '@indexfolio/knowledge-graph'
import { GraphNode } from './components/GraphNode/GraphNode'
import {
  EDGE_DASHED_COLOR,
  NODE_COLORS,
  edgeOpacity,
  nodeOpacity,
} from './utils/graph'
import { useFadingTicker } from './utils/etfTickers'
import { useForceLayout } from './utils/2d/useForceLayout'
import type { RenderedNode } from './utils/2d/useForceLayout'

interface KnowledgeGraph2DProps {
  mode: 'hero' | 'overlay'
  onHomeActivate?: () => void
}

export function KnowledgeGraph2D({
  mode,
  onHomeActivate,
}: Readonly<KnowledgeGraph2DProps>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [dims, setDims] = useState({ width: 0, height: 0 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)

  // The ETF-detail node's label cycles "ETF <ticker>" in real time.
  const { ticker, visible } = useFadingTicker()
  const tickerRef = useRef(ticker)
  useEffect(() => {
    tickerRef.current = ticker
  }, [ticker])

  const { renderedNodes, renderedEdges } = useForceLayout(containerRef, dims)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect)
        setDims({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleNodeClick = useCallback(
    (node: RenderedNode) => {
      // Home is a secret trigger, not a self-link; the detail node opens whichever
      // ticker is showing right now.
      if (node.id === 'home') onHomeActivate?.()
      else if (node.id === 'etf-detail')
        router.push(`/etf/${tickerRef.current}`)
      else router.push(node.href)
    },
    [router, onHomeActivate],
  )

  // Hover takes priority; fall back to keyboard focus for the adjacency highlight.
  const activeId = hoveredId ?? focusedId

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      className={`relative w-full overflow-hidden ${mode === 'hero' ? 'h-screen' : 'h-full'}`}
    >
      <svg width="100%" height="100%" aria-hidden="true" className="block">
        <defs>
          {(Object.entries(NODE_COLORS) as [NodeType, string][]).map(
            ([type]) => (
              <filter
                key={type}
                id={`graph-glow-${type}`}
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
              >
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ),
          )}
        </defs>

        <g>
          {renderedEdges.map((edge) => (
            <line
              key={edge.key}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke={edge.dashed ? EDGE_DASHED_COLOR : 'var(--foreground)'}
              strokeWidth={edge.dashed ? 2 : 1.5}
              strokeDasharray={edge.dashed ? '2 4' : undefined}
              style={{
                opacity: edgeOpacity(edge.sourceId, edge.targetId, activeId),
                transition: 'opacity 0.2s ease',
              }}
            />
          ))}
        </g>

        <g>
          {renderedNodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <GraphNode
                label={node.label}
                type={node.type}
                opacity={nodeOpacity(node.id, activeId)}
                isHome={node.id === 'home'}
                animationIndex={node.index}
                isFocused={focusedId === node.id}
                fading={
                  node.id === 'etf-detail'
                    ? { prefix: 'ETF', value: ticker, visible }
                    : undefined
                }
                outlined={node.id === 'etf-detail'}
                onClick={() => handleNodeClick(node)}
                onPointerEnter={() => setHoveredId(node.id)}
                onPointerLeave={() => setHoveredId(null)}
                onFocus={() => setFocusedId(node.id)}
                onBlur={() => setFocusedId(null)}
              />
            </g>
          ))}
        </g>
      </svg>
    </motion.div>
  )
}
