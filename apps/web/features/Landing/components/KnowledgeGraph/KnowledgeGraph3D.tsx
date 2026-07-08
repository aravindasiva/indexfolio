import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import ForceGraph3D from 'react-force-graph-3d'
import type {
  ForceGraphMethods,
  ForceGraphProps,
  LinkObject,
  NodeObject,
} from 'react-force-graph-3d'
import * as THREE from 'three'
import type { Line2 } from 'three/addons/lines/Line2.js'
import SpriteText from 'three-spritetext'
import {
  edges as graphEdges,
  nodes as graphNodes,
} from '@indexfolio/knowledge-graph'
import type { NodeType } from '@indexfolio/knowledge-graph'
import { EDGE_DASHED_COLOR, edgeOpacity, nodeOpacity } from './utils/graph'
import { useFadingTicker } from './utils/etfTickers'
import { useDetailNode } from './utils/3d/useDetailNode'
import { createDetailPoints, DETAIL_RADIUS } from './utils/3d/detailShape'
import {
  createDashedLine,
  setDashedLineEndpoints,
  DASHED_WIDTH,
  DASHED_WIDTH_ACTIVE,
} from './utils/3d/dashedLink'
import { triggerSupernova, SUPERNOVA_EVENT } from './utils/supernova'

type GraphNodeDatum = {
  id: string
  label: string
  type: NodeType
  href: string
  fx?: number
  fy?: number
  fz?: number
}

type FGNode = NodeObject<GraphNodeDatum>
// The library swaps string source/target for node objects at runtime; the link
// payload only carries our `dashed` flag.
type GraphLinkDatum = { dashed?: boolean }
type FGLink = LinkObject<GraphNodeDatum, GraphLinkDatum>
type FGMethods = ForceGraphMethods<FGNode, FGLink>
type Coords = { x: number; y: number; z: number }

// Narrowed shapes for the OrbitControls / d3-force bits we touch (the library
// types controls() as `object`).
type OrbitLike = {
  autoRotate: boolean
  autoRotateSpeed: number
  enableZoom: boolean
  enableDamping: boolean
}
type ChargeForce = { strength: (value: number) => unknown }
type DistanceForce = {
  distance: (value: number | ((link: FGLink) => number)) => unknown
}

const TOOL_COLOR = '#635BFF'
const HOME_RADIUS = 7
const TOOL_RADIUS = 4
const CAMERA_DISTANCE = 300

// Mirror --foreground from globals.css, derived from the theme rather than read
// from the DOM: next-themes swaps the class in an effect that runs after this
// render, so a DOM read would be one toggle stale (and three.js can't read CSS
// vars anyway).
const FG_LIGHT = 'rgb(9, 9, 11)' // hsl(240 10% 4%)
const FG_DARK = 'rgb(250, 250, 250)' // hsl(0 0% 98%)

function withAlpha(rgb: string, alpha: number): string {
  return rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
}

function idOf(ref: FGLink['source']): string {
  if (ref == null) return ''
  if (typeof ref === 'object') return ref.id
  return String(ref)
}

function isLinkActive(link: FGLink, hoveredId: string | null): boolean {
  return (
    hoveredId != null &&
    (idOf(link.source) === hoveredId || idOf(link.target) === hoveredId)
  )
}

type KnowledgeGraph3DProps = {
  mode: 'hero' | 'overlay'
  onHomeActivate?: () => void
}

export function KnowledgeGraph3D({
  mode,
  onHomeActivate,
}: KnowledgeGraph3DProps) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'
  const fgColor = isDark ? FG_DARK : FG_LIGHT

  const containerRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<FGMethods | undefined>(undefined)

  const [dims, setDims] = useState({ width: 0, height: 0 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // The ETF-detail node's live label + morphing shape (refs to attach below).
  const { ticker, visible } = useFadingTicker()
  const detail = useDetailNode(ticker, visible, hoveredId)

  // Graph data is static; the home node is pinned at the origin so the rest
  // spreads evenly around it (charge + links do the rest).
  const data = useMemo(() => {
    const nodes: GraphNodeDatum[] = graphNodes.map((n) =>
      n.id === 'home'
        ? { ...n, fx: 0, fy: 0, fz: 0 }
        : { id: n.id, label: n.label, type: n.type, href: n.href },
    )
    const links = graphEdges.map((e) => ({
      source: e.source,
      target: e.target,
      dashed: e.dashed,
    }))
    return { nodes, links }
  }, [])

  // The supernova easter egg is owned by the wrapper; we just blast the graph
  // apart (it re-settles) when it fires.
  useEffect(() => {
    function onSupernova() {
      const fg = fgRef.current
      if (fg) triggerSupernova(fg, data.nodes)
    }
    globalThis.addEventListener(SUPERNOVA_EVENT, onSupernova)
    return () => globalThis.removeEventListener(SUPERNOVA_EVENT, onSupernova)
  }, [data.nodes])

  // A sphere (or the detail point cloud) plus a billboarded label. Opacity is
  // baked from the hovered node, so the library rebuilds the few nodes on hover.
  const nodeThreeObject = useCallback(
    (node: FGNode) => {
      const isHome = node.type === 'home'
      const isDetail = node.id === 'etf-detail'
      const color = isHome ? fgColor : TOOL_COLOR
      const radius = isHome ? HOME_RADIUS : TOOL_RADIUS
      const meshRadius = isDetail ? DETAIL_RADIUS : radius
      const opacity = nodeOpacity(node.id, hoveredId)

      const group = new THREE.Group()

      if (isDetail) {
        const points = createDetailPoints(color, opacity, detail.pRef.current)
        detail.attachPoints(points)
        group.add(points)
      } else {
        // Lambert: soft diffuse shading that reads as 3D while the camera orbits.
        group.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            new THREE.MeshLambertMaterial({
              color,
              transparent: true,
              opacity,
            }),
          ),
        )
      }

      const label = new SpriteText(
        isDetail ? `ETF ${detail.tickerRef.current}` : node.label,
      )
      label.color = color
      label.textHeight = isHome ? 3.2 : 2.6
      label.fontFace = isHome ? 'Syne, sans-serif' : 'DM Sans, sans-serif'
      label.fontWeight = isHome ? 'bold' : 'normal'
      label.material.transparent = true
      label.material.opacity = opacity
      label.position.set(0, -(meshRadius + 5), 0)
      if (isDetail) detail.attachSprite(label)
      group.add(label)

      return group
    },
    [hoveredId, fgColor, detail],
  )

  const handleNodeHover = useCallback((node: FGNode | null) => {
    setHoveredId(node?.id ?? null)
  }, [])

  const handleNodeClick = useCallback(
    (node: FGNode) => {
      // Home is a secret trigger, not a self-link; the detail node opens whichever
      // ticker is showing right now.
      if (node.type === 'home') onHomeActivate?.()
      else if (node.id === 'etf-detail')
        router.push(`/etf/${detail.tickerRef.current}`)
      else router.push(node.href)
    },
    [router, onHomeActivate, detail],
  )

  // Dotted ETF edges are our own fat line; every other link keeps the default.
  // Rebuilt on hover (fade/thicken) and resize (line-width resolution).
  const linkThreeObject = useCallback(
    (link: FGLink): THREE.Object3D | undefined => {
      if (!link.dashed) return undefined
      return createDashedLine({
        color: EDGE_DASHED_COLOR,
        opacity: edgeOpacity(idOf(link.source), idOf(link.target), hoveredId),
        linewidth: isLinkActive(link, hoveredId)
          ? DASHED_WIDTH_ACTIVE
          : DASHED_WIDTH,
        width: dims.width,
        height: dims.height,
      })
    },
    [hoveredId, dims.width, dims.height],
  )

  const linkPositionUpdate = useCallback(
    (
      obj: THREE.Object3D,
      coords: { start: Coords; end: Coords },
      link: FGLink,
    ) => {
      if (!link.dashed) return false // let the library position default links
      setDashedLineEndpoints(obj as Line2, coords.start, coords.end)
      return true
    },
    [],
  )

  // Tune forces, controls, and scroll behaviour once the graph is mounted.
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return

    const charge = fg.d3Force('charge') as ChargeForce | undefined
    charge?.strength(-140)
    const link = fg.d3Force('link') as DistanceForce | undefined
    // Dotted (ETF) edges sit closer, so they read as short connectors.
    link?.distance((edge) => (edge.dashed ? 32 : 70))
    fg.d3Force('center', null)
    fg.cameraPosition({ z: CAMERA_DISTANCE })

    const controls = fg.controls() as OrbitLike
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.enableDamping = true
    // Zoom is locked so the wheel always scrolls to the next section.
    controls.enableZoom = false
  }, [dims.width])

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

  // Pause the render loop when scrolled off-screen.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) fgRef.current?.resumeAnimation()
        else fgRef.current?.pauseAnimation()
      },
      { threshold: 0.05 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${mode === 'hero' ? 'h-screen' : 'h-full'}`}
      style={{ cursor: hoveredId ? 'pointer' : 'grab' }}
    >
      {dims.width > 0 && (
        <ForceGraph3D<GraphNodeDatum, GraphLinkDatum>
          ref={fgRef}
          controlType="orbit"
          width={dims.width}
          height={dims.height}
          graphData={data}
          backgroundColor="rgba(0,0,0,0)"
          showNavInfo={false}
          enableNodeDrag={false}
          nodeThreeObject={nodeThreeObject}
          // The lib types these accessors strictly (linkThreeObject can't return
          // undefined; linkPositionUpdate is an independent generic), so the
          // concretely-typed callbacks need a cast to line up.
          linkThreeObject={
            linkThreeObject as ForceGraphProps<
              GraphNodeDatum,
              GraphLinkDatum
            >['linkThreeObject']
          }
          linkPositionUpdate={
            linkPositionUpdate as ForceGraphProps<
              GraphNodeDatum,
              GraphLinkDatum
            >['linkPositionUpdate']
          }
          linkColor={(link) =>
            withAlpha(
              fgColor,
              edgeOpacity(idOf(link.source), idOf(link.target), hoveredId),
            )
          }
          linkWidth={(link) => (isLinkActive(link, hoveredId) ? 2.4 : 1)}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
        />
      )}
    </div>
  )
}
