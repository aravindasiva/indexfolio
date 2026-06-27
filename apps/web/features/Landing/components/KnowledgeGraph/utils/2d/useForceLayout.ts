import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import type {
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from 'd3-force'
import {
  edges as graphEdges,
  nodes as graphNodes,
} from '@indexfolio/knowledge-graph'
import type { NodeType } from '@indexfolio/knowledge-graph'
import { random } from '@/lib/random'

type SimNode = SimulationNodeDatum & {
  id: string
  label: string
  type: NodeType
  href: string
}
type SimEdge = SimulationLinkDatum<SimNode> & { dashed?: boolean }

export interface RenderedNode {
  id: string
  label: string
  type: NodeType
  href: string
  x: number
  y: number
  index: number
}

export interface RenderedEdge {
  key: string
  sourceId: string
  targetId: string
  x1: number
  y1: number
  x2: number
  y2: number
  dashed?: boolean
}

type Dims = { width: number; height: number }

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

/*
  Runs the d3 force layout and returns positioned nodes/edges for the SVG to draw.
  Spokes seed in a ring (array order + one random rotation per load) so related
  nodes - the ETF cluster next to the Screener - stay adjacent while the layout
  still feels free-form; charge + links then spread them out. Pauses off-screen.
*/
export function useForceLayout(
  containerRef: RefObject<HTMLDivElement | null>,
  dims: Dims,
): { renderedNodes: RenderedNode[]; renderedEdges: RenderedEdge[] } {
  const nodesRef = useRef<SimNode[]>([])
  const edgesRef = useRef<SimEdge[]>([])
  const simRef = useRef<Simulation<SimNode, SimEdge> | null>(null)
  const rafPending = useRef(false)
  const [renderedNodes, setRenderedNodes] = useState<RenderedNode[]>([])
  const [renderedEdges, setRenderedEdges] = useState<RenderedEdge[]>([])

  useEffect(() => {
    if (dims.width === 0 || dims.height === 0) return

    const { width, height } = dims
    const cx = width / 2
    const cy = height / 2
    const pad = 100 // room for labels rendered below nodes

    const jitter = () => (random() - 0.5) * 12

    // Seed spokes around the hub in array order with a random global rotation, so
    // related nodes stay together (rather than starting dead-centre at random).
    const spokes = graphNodes.filter((n) => n.id !== 'home')
    const baseAngle = random() * Math.PI * 2
    const seedRadius = 40
    const angleById = new Map(
      spokes.map((n, i) => [
        n.id,
        baseAngle + (i / spokes.length) * Math.PI * 2,
      ]),
    )

    const simNodes: SimNode[] = graphNodes.map((n) => {
      if (n.id === 'home') return { ...n, x: cx, y: cy, fx: cx, fy: cy }
      const angle = angleById.get(n.id) ?? 0
      return {
        ...n,
        x: cx + Math.cos(angle) * seedRadius + jitter(),
        y: cy + Math.sin(angle) * seedRadius + jitter(),
      }
    })
    const simEdges: SimEdge[] = graphEdges.map((e) => ({ ...e }))

    nodesRef.current = simNodes
    edgesRef.current = simEdges

    function onRafComplete() {
      rafPending.current = false
      const posMap = new Map<string, { x: number; y: number }>()
      const nextNodes: RenderedNode[] = []
      for (let i = 0; i < nodesRef.current.length; i++) {
        const n = nodesRef.current[i]
        if (n?.x != null && n.y != null) {
          const x = n.fx == null ? clamp(n.x, pad, width - pad) : n.x
          const y = n.fy == null ? clamp(n.y, pad, height - pad) : n.y
          posMap.set(n.id, { x, y })
          nextNodes.push({ ...n, x, y, index: i })
        }
      }

      const nextEdges: RenderedEdge[] = []
      for (const edge of edgesRef.current) {
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
            dashed: edge.dashed,
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

    // Charge repulsion + link distance give an organic hub-and-spoke layout
    // (no forceRadial, so it's never perfectly symmetric).
    const linkDistance = Math.min(width, height) * 0.26
    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimEdge>(simEdges)
          .id((d) => d.id)
          // Dotted (ETF) edges sit closer, so they read as short connectors.
          .distance((edge) =>
            edge.dashed ? linkDistance * 0.45 : linkDistance,
          )
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

  // Pause the simulation when scrolled off-screen.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) simRef.current?.restart()
        else simRef.current?.stop()
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [containerRef])

  return { renderedNodes, renderedEdges }
}
