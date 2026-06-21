import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import ForceGraph3D from 'react-force-graph-3d'
import type {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from 'react-force-graph-3d'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import {
  edges as graphEdges,
  nodes as graphNodes,
} from '@indexfolio/knowledge-graph'
import type { NodeType } from '@indexfolio/knowledge-graph'
import { edgeOpacity, nodeOpacity } from './_lib/graph'
import { createStarfield } from './_lib/createStarfield'
import type { Starfield } from './_lib/createStarfield'
import { triggerSupernova, SUPERNOVA_EVENT } from './_lib/supernova'

// ─── Types ────────────────────────────────────────────────────────────────────

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
// Link payload is empty: the library swaps the string source/target for node
// objects at runtime, so we let LinkObject supply that union.
type FGLink = LinkObject<GraphNodeDatum>
type FGMethods = ForceGraphMethods<FGNode, FGLink>

// Narrowed shapes for the parts of the OrbitControls / d3-force APIs we touch
// (react-force-graph types controls() as `object`).
type OrbitLike = {
  autoRotate: boolean
  autoRotateSpeed: number
  enableZoom: boolean
  enableDamping: boolean
}
type ChargeForce = { strength: (value: number) => unknown }
type DistanceForce = { distance: (value: number) => unknown }

// ─── Constants ────────────────────────────────────────────────────────────────

const TOOL_COLOR = '#635BFF'
const HOME_RADIUS = 7
const TOOL_RADIUS = 4
const CAMERA_DISTANCE = 300

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Resolve a CSS custom property to a concrete `rgb(...)` string three.js can
// parse, by reading the computed colour off a throwaway element.
function resolveCssColor(expr: string): string {
  const probe = document.createElement('span')
  probe.style.color = expr
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const rgb = getComputedStyle(probe).color
  probe.remove()
  return rgb || 'rgb(255, 255, 255)'
}

// --foreground is constant per theme, so resolve it once per theme key.
const foregroundCache = new Map<string, string>()
function foregroundColor(themeKey: string): string {
  const cached = foregroundCache.get(themeKey)
  if (cached) return cached
  const color = resolveCssColor('var(--foreground)')
  foregroundCache.set(themeKey, color)
  return color
}

// `rgb(r, g, b)` -> `rgba(r, g, b, a)`
function withAlpha(rgb: string, alpha: number): string {
  return rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
}

function idOf(ref: FGLink['source']): string {
  if (ref == null) return ''
  if (typeof ref === 'object') return ref.id
  return String(ref)
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  const themeKey = resolvedTheme ?? 'dark'
  const isDark = resolvedTheme !== 'light'

  const containerRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<FGMethods | undefined>(undefined)
  const starfieldRef = useRef<Starfield | null>(null)
  const isDarkRef = useRef(isDark)

  useEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  const [dims, setDims] = useState({ width: 0, height: 0 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Graph data is static; the home node is pinned at the origin so every other
  // node spreads evenly around it (charge + links do the rest).
  const data = useMemo(() => {
    const nodes: GraphNodeDatum[] = graphNodes.map((n) =>
      n.id === 'home'
        ? { ...n, fx: 0, fy: 0, fz: 0 }
        : { id: n.id, label: n.label, type: n.type, href: n.href },
    )
    const links = graphEdges.map((e) => ({
      source: e.source,
      target: e.target,
    }))
    return { nodes, links }
  }, [])

  // The easter egg is owned by the wrapper; here we just blast the graph apart
  // (it re-settles) when the wrapper dispatches the supernova event.
  useEffect(() => {
    function onSupernova() {
      const fg = fgRef.current
      if (fg) triggerSupernova(fg, data.nodes)
    }
    globalThis.addEventListener(SUPERNOVA_EVENT, onSupernova)
    return () => globalThis.removeEventListener(SUPERNOVA_EVENT, onSupernova)
  }, [data.nodes])

  // Each node is a sphere + a billboarded label. Opacity is baked from the
  // hovered node, so react-force-graph rebuilds the (few) nodes on hover - no
  // imperative mutation of retained objects. Theme drives the home colour.
  const nodeThreeObject = useCallback(
    (node: FGNode) => {
      const isHome = node.type === 'home'
      const color = isHome ? foregroundColor(themeKey) : TOOL_COLOR
      const radius = isHome ? HOME_RADIUS : TOOL_RADIUS
      const opacity = nodeOpacity(node.id, hoveredId)

      const group = new THREE.Group()

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        // Lambert: soft diffuse shading reads as 3D as the camera orbits, with
        // no fixed specular hotspot. Avoids the lighting/environment rabbit hole.
        new THREE.MeshLambertMaterial({ color, transparent: true, opacity }),
      )
      group.add(sphere)

      const label = new SpriteText(node.label)
      label.color = color
      label.textHeight = isHome ? 3.2 : 2.6
      label.fontFace = isHome ? 'Syne, sans-serif' : 'DM Sans, sans-serif'
      label.fontWeight = isHome ? 'bold' : 'normal'
      label.material.transparent = true
      label.material.opacity = opacity
      label.position.set(0, -(radius + 5), 0)
      group.add(label)

      return group
    },
    [hoveredId, themeKey],
  )

  const handleNodeHover = useCallback((node: FGNode | null) => {
    setHoveredId(node?.id ?? null)
  }, [])

  const handleNodeClick = useCallback(
    (node: FGNode) => {
      // The home node is a secret trigger, not a (pointless) self-link.
      if (node.type === 'home') onHomeActivate?.()
      else router.push(node.href)
    },
    [router, onHomeActivate],
  )

  // ── Tune forces, controls, and scroll behaviour once mounted ──────────────
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return

    // Pin the layout around the fixed home node (no centering force needed).
    const charge = fg.d3Force('charge') as ChargeForce | undefined
    charge?.strength(-140)
    const link = fg.d3Force('link') as DistanceForce | undefined
    link?.distance(70)
    fg.d3Force('center', null)
    fg.cameraPosition({ z: CAMERA_DISTANCE })

    const controls = fg.controls() as OrbitLike
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.enableDamping = true
    // Zoom is locked so the wheel always scrolls the page to the next section.
    controls.enableZoom = false
  }, [dims.width])

  // ── Starfield inside the scene (parallaxes as the camera orbits) ──────────
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return
    const starfield = createStarfield(
      fg.scene(),
      fg.camera(),
      isDarkRef.current,
    )
    starfieldRef.current = starfield
    return () => {
      starfield.dispose()
      starfieldRef.current = null
    }
  }, [dims.width])

  useEffect(() => {
    starfieldRef.current?.setDark(isDark)
  }, [isDark])

  // ── Track container size ──────────────────────────────────────────────────
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

  // ── Pause the render loop when scrolled off-screen ────────────────────────
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
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
        starfieldRef.current?.setPointer(nx, -ny)
      }}
    >
      {dims.width > 0 && (
        <ForceGraph3D<GraphNodeDatum>
          ref={fgRef}
          controlType="orbit"
          width={dims.width}
          height={dims.height}
          graphData={data}
          backgroundColor="rgba(0,0,0,0)"
          showNavInfo={false}
          enableNodeDrag={false}
          nodeThreeObject={nodeThreeObject}
          linkColor={(link) =>
            withAlpha(
              foregroundColor(themeKey),
              edgeOpacity(idOf(link.source), idOf(link.target), hoveredId),
            )
          }
          linkWidth={(link) =>
            hoveredId &&
            (idOf(link.source) === hoveredId || idOf(link.target) === hoveredId)
              ? 2.4
              : 1
          }
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
        />
      )}
    </div>
  )
}
