import * as THREE from 'three'

/*
  The ETF-detail node is a point cloud that morphs between shapes by tweening one
  number. Each point is a fixed sphere direction pushed onto a superellipsoid of
  exponent p (2 = sphere, 1 = octahedron, large = cube, < 1 = star). A constant
  point count means positions interpolate cleanly with no popping, and points
  read evenly on every shape - a wireframe looked sparse on a cube or pyramid.
*/
export const DETAIL_RADIUS = 6.8 // ~1.7x a tool node
const POINT_COUNT = 250
const POINT_SIZE = 1.9
// Cycled in order; spread out so each reads distinctly.
export const SHAPE_EXPONENTS = [2, 1, 8, 4, 1.4]

// Evenly distributed unit directions (Fibonacci sphere), shared by every shape.
const SPHERE_DIRS = (() => {
  const dirs: { x: number; y: number; z: number }[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < POINT_COUNT; i++) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    dirs.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r })
  }
  return dirs
})()

function superRadius(x: number, y: number, z: number, p: number): number {
  const s = Math.abs(x) ** p + Math.abs(y) ** p + Math.abs(z) ** p
  return s === 0 ? 0 : s ** (-1 / p)
}

function writePositions(target: Float32Array, p: number): void {
  for (let i = 0; i < SPHERE_DIRS.length; i++) {
    const d = SPHERE_DIRS[i]
    if (!d) continue
    const r = superRadius(d.x, d.y, d.z, p) * DETAIL_RADIUS
    target[i * 3] = d.x * r
    target[i * 3 + 1] = d.y * r
    target[i * 3 + 2] = d.z * r
  }
}

// A point cloud shaped to exponent p, in the given colour/opacity.
export function createDetailPoints(
  color: string,
  opacity: number,
  p: number,
): THREE.Points {
  const positions = new Float32Array(POINT_COUNT * 3)
  writePositions(positions, p)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color,
      size: POINT_SIZE,
      sizeAttenuation: false,
      transparent: true,
      opacity,
    }),
  )
}

// Reshape an existing cloud to exponent p (used each frame by the morph tween).
export function reshapeDetailPoints(points: THREE.Points, p: number): void {
  const attr = points.geometry.getAttribute('position') as THREE.BufferAttribute
  writePositions(attr.array as Float32Array, p)
  attr.needsUpdate = true
}
