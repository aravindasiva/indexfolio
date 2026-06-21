/*
  Supernova: blast the graph apart, then ease it back together.

  1. Drop the link force strength to 0 so the spokes are released.
  2. Give every (non-pinned) node an outward velocity kick - with the tethers
     gone they drift out.
  3. After FREE_MS, ramp the link strength from 0 back up to its resting value
     over RETURN_MS so the links reel the nodes in gradually and they ease into
     place instead of snapping back. The home node stays pinned and anchors it.

  Done on the live sim nodes in a plain module function (not React scope), so it
  is physics-accurate and lint-clean. KICK, FREE_MS and RETURN_MS are the dials.
*/
type SupernovaNode = {
  x?: number
  y?: number
  z?: number
  vx?: number
  vy?: number
  vz?: number
  fx?: number | null
}

// d3-force's link strength is either a constant or a per-link accessor. Setting
// it re-initialises the internal strengths array, so updating it each frame
// during the ramp takes effect on the next tick.
type StrengthAccessor =
  | number
  | ((link: unknown, index: number, links: unknown[]) => number)
type LinkForce = { strength: (value?: StrengthAccessor) => StrengthAccessor }
type SupernovaTarget = {
  d3Force: (name: string) => unknown
  d3ReheatSimulation: () => unknown
}

// Window event the wrapper dispatches and the 3D graph listens for.
export const SUPERNOVA_EVENT = 'indexfolio:supernova'

const KICK = 2
const FREE_MS = 800
const RETURN_MS = 1000

// How long the whole effect runs, so overlays (the particle burst) can fade in
// sync with the graph settling back down.
export const SUPERNOVA_DURATION_MS = FREE_MS + RETURN_MS

// Smooth S-curve: gentle pull at the start, gentle settle at the end.
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function triggerSupernova(fg: SupernovaTarget, nodes: SupernovaNode[]) {
  const link = fg.d3Force('link') as LinkForce | undefined
  const resting = link?.strength()
  link?.strength(0)

  for (const node of nodes) {
    if (node.fx != null) continue // leave the pinned home node anchored
    const x = node.x ?? 0
    const y = node.y ?? 0
    const z = node.z ?? 0
    const distance = Math.hypot(x, y, z) || 1
    node.vx = (x / distance) * KICK
    node.vy = (y / distance) * KICK
    node.vz = (z / distance) * KICK
  }
  fg.d3ReheatSimulation()

  if (!link || resting === undefined) return
  // Capture the narrowed values so the closures below keep the non-undefined type.
  const linkForce = link
  const restingStrength = resting

  window.setTimeout(() => {
    // Scale the resting strength by an eased factor each frame so the links
    // tighten gradually rather than yanking every node home at once.
    const base = (l: unknown, i: number, links: unknown[]): number =>
      typeof restingStrength === 'function'
        ? restingStrength(l, i, links)
        : restingStrength
    const start = performance.now()
    fg.d3ReheatSimulation()

    function ramp(now: number) {
      const t = Math.min(1, (now - start) / RETURN_MS)
      if (t < 1) {
        const factor = easeInOut(t)
        linkForce.strength((l, i, links) => base(l, i, links) * factor)
        requestAnimationFrame(ramp)
      } else {
        linkForce.strength(restingStrength) // restore the original accessor
      }
    }
    requestAnimationFrame(ramp)
  }, FREE_MS)
}
