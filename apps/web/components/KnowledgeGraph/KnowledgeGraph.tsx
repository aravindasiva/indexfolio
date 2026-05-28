'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import type { Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3-force'
import { edges as graphEdges, nodes as graphNodes } from '@indexfolio/knowledge-graph'
import type { NodeType } from '@indexfolio/knowledge-graph'
import { GraphNode, NODE_COLORS } from './_components/GraphNode'

// ─── Types ────────────────────────────────────────────────────────────────────

type SimNode = SimulationNodeDatum & {
  id: string
  label: string
  type: NodeType
  href: string
}

type SimEdge = SimulationLinkDatum<SimNode>

interface RenderedNode {
  id: string
  label: string
  type: NodeType
  href: string
  x: number
  y: number
  index: number
}

interface RenderedEdge {
  key: string
  sourceId: string
  targetId: string
  x1: number
  y1: number
  x2: number
  y2: number
}

// ─── Module-level helpers ─────────────────────────────────────────────────────

function buildAdjacency(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const e of graphEdges) {
    let src = map.get(e.source)
    if (!src) {
      src = new Set<string>()
      map.set(e.source, src)
    }
    let tgt = map.get(e.target)
    if (!tgt) {
      tgt = new Set<string>()
      map.set(e.target, tgt)
    }
    src.add(e.target)
    tgt.add(e.source)
  }
  return map
}

const ADJACENCY = buildAdjacency()

function nodeOpacity(nodeId: string, hoveredId: string | null): number {
  if (!hoveredId) return 1
  if (nodeId === hoveredId) return 1
  if (ADJACENCY.get(hoveredId)?.has(nodeId)) return 1
  return 0.12
}

function edgeOpacity(srcId: string, tgtId: string, hoveredId: string | null): number {
  if (!hoveredId) return 0.2
  if (srcId === hoveredId || tgtId === hoveredId) return 0.7
  return 0.04
}

function resolveId(ref: string | number | SimNode): string {
  if (typeof ref === 'string') return ref
  if (typeof ref === 'number') return `n${ref}`
  return ref.id
}

function edgeKey(edge: SimEdge): string {
  return `${resolveId(edge.source)}-${resolveId(edge.target)}`
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min
  if (value > max) return max
  return value
}

// ─── Component ────────────────────────────────────────────────────────────────

interface KnowledgeGraphProps {
  mode: 'hero' | 'overlay'
}

export function KnowledgeGraph({ mode }: Readonly<KnowledgeGraphProps>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const nodesRef = useRef<SimNode[]>([])
  const edgesRef = useRef<SimEdge[]>([])
  const simRef = useRef<Simulation<SimNode, SimEdge> | null>(null)
  const rafPending = useRef(false)

  const [dims, setDims] = useState({ width: 0, height: 0 })
  const [renderedNodes, setRenderedNodes] = useState<RenderedNode[]>([])
  const [renderedEdges, setRenderedEdges] = useState<RenderedEdge[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)

  // ── Container dimensions ──────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) setDims({ width: Math.floor(rect.width), height: Math.floor(rect.height) })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── D3 simulation ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (dims.width === 0 || dims.height === 0) return

    const { width, height } = dims
    const cx = width / 2
    const cy = height / 2
    // Larger pad to leave room for labels rendered below nodes
    const pad = 100

    // All non-home nodes start at the centre with a tiny jitter.
    // The charge + link forces then push them outward organically — this IS
    // the spread animation, and the result is never perfectly symmetric.
    function jitter() {
      return (Math.random() - 0.5) * 12
    }

    const simNodes: SimNode[] = graphNodes.map((n) => {
      if (n.id === 'home') {
        return { ...n, x: cx, y: cy, fx: cx, fy: cy }
      }
      return { ...n, x: cx + jitter(), y: cy + jitter() }
    })
    const simEdges: SimEdge[] = graphEdges.map((e) => ({ ...e }))

    nodesRef.current = simNodes
    edgesRef.current = simEdges

    function onRafComplete() {
      rafPending.current = false
      const nodes = nodesRef.current
      const edges = edgesRef.current

      const posMap = new Map<string, { x: number; y: number }>()
      const nextNodes: RenderedNode[] = []
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (n?.x != null && n.y != null) {
          const x = n.fx == null ? clamp(n.x, pad, width - pad) : n.x
          const y = n.fy == null ? clamp(n.y, pad, height - pad) : n.y
          posMap.set(n.id, { x, y })
          nextNodes.push({ id: n.id, label: n.label, type: n.type, href: n.href, x, y, index: i })
        }
      }

      const nextEdges: RenderedEdge[] = []
      for (const edge of edges) {
        const srcId = resolveId(edge.source)
        const tgtId = resolveId(edge.target)
        const src = posMap.get(srcId)
        const tgt = posMap.get(tgtId)
        if (src && tgt) {
          nextEdges.push({
            key: edgeKey(edge),
            sourceId: srcId,
            targetId: tgtId,
            x1: src.x,
            y1: src.y,
            x2: tgt.x,
            y2: tgt.y,
          })
        }
      }

      setRenderedNodes(nextNodes)
      setRenderedEdges(nextEdges)
    }

    function onSimTick() {
      if (rafPending.current) return
      rafPending.current = true
      requestAnimationFrame(onRafComplete)
    }

    // No forceRadial — charge repulsion + link distance produce the organic
    // hub-and-spoke layout naturally and avoid perfect symmetry.
    const linkDistance = Math.min(width, height) * 0.26

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimEdge>(simEdges)
          .id((d) => d.id)
          .distance(linkDistance)
          .strength(0.55),
      )
      .force('charge', forceManyBody<SimNode>().strength(-320))
      .force('collide', forceCollide<SimNode>(42))
      .alphaDecay(0.012)
      .velocityDecay(0.38)
      .on('tick', onSimTick)

    simRef.current = sim

    return () => {
      sim.stop()
      rafPending.current = false
    }
  }, [dims])

  // ── Pause when scrolled off-screen ────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          simRef.current?.restart()
        } else {
          simRef.current?.stop()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleNodeClick = useCallback(
    (href: string) => {
      router.push(href)
    },
    [router],
  )

  // Hover takes priority; fall back to keyboard focus for the adjacency highlight
  const activeId = hoveredId ?? focusedId

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      className={`relative w-full overflow-hidden ${mode === 'hero' ? 'h-screen' : 'h-full'}`}
    >
      {/* Screen-reader navigation */}
      <nav aria-label="Explore Indexfolio" className="sr-only">
        <ul>
          {graphNodes.map((node) => (
            <li key={node.id}>
              <a href={node.href}>{node.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <svg width="100%" height="100%" aria-hidden="true" className="block">
        <defs>
          {(Object.entries(NODE_COLORS) as [NodeType, string][]).map(([type]) => (
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
          ))}
        </defs>

        {/* Edges */}
        <g>
          {renderedEdges.map((edge) => (
            <line
              key={edge.key}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="var(--foreground)"
              strokeWidth={1.5}
              style={{
                opacity: edgeOpacity(edge.sourceId, edge.targetId, activeId),
                transition: 'opacity 0.2s ease',
              }}
            />
          ))}
        </g>

        {/* Nodes */}
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
                onClick={() => handleNodeClick(node.href)}
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
