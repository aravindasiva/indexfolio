import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { Material } from 'three'
import type * as THREE from 'three'
import type SpriteText from 'three-spritetext'
import { nodeOpacity } from '../graph'
import { reshapeDetailPoints, SHAPE_EXPONENTS } from './detailShape'

const FADE_MS = 250
const MORPH_MS = 700

// Tween a material's opacity over `ms`.
function fadeOpacity(material: Material, to: number, ms: number): void {
  const from = material.opacity
  const start = performance.now()
  function step(now: number) {
    const t = Math.min((now - start) / ms, 1)
    material.opacity = from + (to - from) * t
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/*
  Owns the live animation of the ETF-detail node and hands back refs for the
  renderer to attach. As the ticker cycles, the label fades-swaps-fades and the
  point cloud smoothly morphs to the next shape; the cloud also tumbles slowly so
  its 3D form reads (the camera orbits the graph but never spins a node on its
  axis). All imperative, so only this one node animates - the graph isn't rebuilt.
*/
export function useDetailNode(
  ticker: string,
  visible: boolean,
  hoveredId: string | null,
) {
  const tickerRef = useRef(ticker)
  const spriteRef = useRef<SpriteText | null>(null)
  const pointsRef = useRef<THREE.Points | null>(null)
  const pRef = useRef(SHAPE_EXPONENTS[0] ?? 2)
  const expIndexRef = useRef(0)
  const hoveredIdRef = useRef<string | null>(null)

  useEffect(() => {
    hoveredIdRef.current = hoveredId
  }, [hoveredId])

  // Label fades out, swaps text, fades back in (a sprite can't morph its text).
  useEffect(() => {
    tickerRef.current = ticker
    const sprite = spriteRef.current
    if (!sprite) return
    if (visible) {
      sprite.text = `ETF ${ticker}`
      fadeOpacity(
        sprite.material,
        nodeOpacity('etf-detail', hoveredIdRef.current),
        FADE_MS,
      )
    } else {
      fadeOpacity(sprite.material, 0, FADE_MS)
    }
  }, [ticker, visible])

  // Smoothly morph the cloud to the next superellipsoid by tweening exponent p.
  useEffect(() => {
    if (!pointsRef.current) return
    expIndexRef.current = (expIndexRef.current + 1) % SHAPE_EXPONENTS.length
    const fromP = pRef.current
    const toP = SHAPE_EXPONENTS[expIndexRef.current] ?? 2
    const start = performance.now()
    let raf = 0
    function step(now: number) {
      const t = Math.min((now - start) / MORPH_MS, 1)
      const eased = t * t * (3 - 2 * t)
      pRef.current = fromP + (toP - fromP) * eased
      if (pointsRef.current)
        reshapeDetailPoints(pointsRef.current, pRef.current)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [ticker])

  // Gentle self-spin so the morphing shape reads as 3D (label stays upright).
  useEffect(() => {
    let raf = 0
    function spin() {
      const points = pointsRef.current
      if (points) {
        points.rotation.y += 0.004
        points.rotation.x += 0.0015
      }
      raf = requestAnimationFrame(spin)
    }
    raf = requestAnimationFrame(spin)
    return () => cancelAnimationFrame(raf)
  }, [])

  // The renderer attaches the freshly-built objects via these setters (the React
  // Compiler forbids mutating a ref handed back from a hook directly).
  const attachSprite = useCallback((sprite: SpriteText) => {
    spriteRef.current = sprite
  }, [])
  const attachPoints = useCallback((points: THREE.Points) => {
    pointsRef.current = points
  }, [])

  // tickerRef / pRef are read-only here (so the renderer can read them without
  // re-running on every tick); attach* let it wire up the live objects.
  return useMemo(
    () => ({ tickerRef, pRef, attachSprite, attachPoints }),
    [attachSprite, attachPoints],
  )
}
