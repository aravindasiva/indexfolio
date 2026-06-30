import * as THREE from 'three'
import { random, randomRange } from '@/lib/random'

/*
  Background atmosphere inside the graph's 3D scene, so it parallaxes as the
  camera orbits (the depth cue that makes the page read as 3D). Two looks by
  theme: dark = scattered star field (deep space); light = a dotted sphere grid
  wrapping the graph (stars in daylight make no sense). The group also tilts
  toward the pointer for extra parallax. Pure three.js so it stays reusable.
  Shooting stars (dark only) spawn in front of the camera so they always streak
  across the current view rather than floating on top as an overlay.
*/

export type Starfield = {
  setDark: (dark: boolean) => void
  setPointer: (nx: number, ny: number) => void
  dispose: () => void
}

const SMALL_COUNT = 480
const BIG_COUNT = 90
const INNER_RADIUS = 400
const OUTER_RADIUS = 1700

const SPHERE_RADIUS = 320
const SPHERE_LAT_RINGS = 16
const SPHERE_LON_BASE = 40

const STAR_COLOR = new THREE.Color('#ffffff')
const SPHERE_COLOR = new THREE.Color('#475569')

const PARALLAX_MAX = 0.05
const PARALLAX_EASE = 0.05

// Shooting stars (dark only): a bright point-trail spawned relative to the camera
// so it always crosses the current view, then fades. Deliberately rare.
const TRAIL_POINTS = 18
const SHOOT_DIST = 200
const SHOOT_HALF_WIDTH = 240
const SHOOT_TRAIL_LEN = 60
const SHOOT_SIZE = 1
const SHOOT_LIFE_MS = 1100
const SHOOT_MIN_GAP_MS = 7000
const SHOOT_MAX_EXTRA_MS = 15000

// Round, mostly-crisp point texture (a small soft edge, not a blurry blob).
function makePointTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const r = size / 2
    const gradient = ctx.createRadialGradient(r, r, 0, r, r, r)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.45, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(r, r, r, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Uniform-ish point on a spherical shell around the origin.
function randomShellPoint(): [number, number, number] {
  const theta = 2 * Math.PI * random()
  const phi = Math.acos(2 * random() - 1)
  const radius = randomRange(INNER_RADIUS, OUTER_RADIUS)
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ]
}

// Mostly neutral, with a few subtly tinted points (multipliers over the base).
function randomTint(): THREE.Color {
  const roll = random()
  if (roll < 0.72) return new THREE.Color(1, 1, 1)
  if (roll < 0.84) return new THREE.Color(1, 0.95, 0.82) // warm
  if (roll < 0.93) return new THREE.Color(0.85, 0.92, 1) // blue
  return new THREE.Color(1, 0.85, 0.82) // red
}

function pointsMaterial(
  size: number,
  texture: THREE.Texture,
  color: THREE.Color,
  opacity: number,
  vertexColors: boolean,
): THREE.PointsMaterial {
  return new THREE.PointsMaterial({
    size,
    map: texture,
    color,
    opacity,
    vertexColors,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
    alphaTest: 0.2,
  })
}

// Scattered star layer (dark theme).
function buildStarLayer(
  count: number,
  size: number,
  texture: THREE.Texture,
): THREE.Points {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const [x, y, z] = randomShellPoint()
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    const tint = randomTint()
    colors[i * 3] = tint.r
    colors[i * 3 + 1] = tint.g
    colors[i * 3 + 2] = tint.b
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return new THREE.Points(
    geometry,
    pointsMaterial(size, texture, STAR_COLOR, 0.9, true),
  )
}

// Lat/long dot grid on a sphere wrapping the graph (light theme).
function buildSphereGrid(texture: THREE.Texture): THREE.Points {
  const positions: number[] = []
  for (let i = 1; i < SPHERE_LAT_RINGS; i++) {
    const lat = -Math.PI / 2 + (i / SPHERE_LAT_RINGS) * Math.PI
    const y = SPHERE_RADIUS * Math.sin(lat)
    const ringRadius = SPHERE_RADIUS * Math.cos(lat)
    const lonCount = Math.max(6, Math.round(SPHERE_LON_BASE * Math.cos(lat)))
    for (let j = 0; j < lonCount; j++) {
      const lon = (j / lonCount) * Math.PI * 2
      positions.push(ringRadius * Math.cos(lon), y, ringRadius * Math.sin(lon))
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  )
  return new THREE.Points(
    geometry,
    pointsMaterial(4.5, texture, SPHERE_COLOR, 0.7, false),
  )
}

export function createStarfield(
  scene: THREE.Scene,
  camera: THREE.Camera,
  initialDark: boolean,
): Starfield {
  const texture = makePointTexture()
  const group = new THREE.Group()

  const stars = [
    buildStarLayer(SMALL_COUNT, 5, texture),
    buildStarLayer(BIG_COUNT, 11, texture),
  ]
  const sphereGrid = buildSphereGrid(texture)
  for (const layer of stars) group.add(layer)
  group.add(sphereGrid)
  scene.add(group)

  // Shooting stars: a point-trail spawned in front of the camera.
  const shootGeometry = new THREE.BufferGeometry()
  shootGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(TRAIL_POINTS * 3), 3),
  )
  const shootColors = new Float32Array(TRAIL_POINTS * 3)
  for (let i = 0; i < TRAIL_POINTS; i++) {
    const fade = 1 - i / (TRAIL_POINTS - 1) // head bright -> tail dark
    shootColors[i * 3] = fade
    shootColors[i * 3 + 1] = fade
    shootColors[i * 3 + 2] = fade
  }
  shootGeometry.setAttribute('color', new THREE.BufferAttribute(shootColors, 3))
  const shootMaterial = new THREE.PointsMaterial({
    size: SHOOT_SIZE,
    map: texture,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })
  const shootingStar = new THREE.Points(shootGeometry, shootMaterial)
  shootingStar.visible = false
  // Positions are rewritten every frame; without this the stale bounding sphere
  // (computed at the origin) gets frustum-culled and the streak never renders.
  shootingStar.frustumCulled = false
  scene.add(shootingStar)

  let dark = initialDark
  let shootTimer: ReturnType<typeof setTimeout> | undefined
  let shootRaf = 0

  function scheduleShoot() {
    if (!dark) return
    shootTimer = setTimeout(
      fireShoot,
      SHOOT_MIN_GAP_MS + random() * SHOOT_MAX_EXTRA_MS,
    )
  }

  function fireShoot() {
    const forward = camera.position.clone().negate().normalize()
    const right = new THREE.Vector3()
      .crossVectors(forward, camera.up)
      .normalize()
    const up = new THREE.Vector3().crossVectors(right, forward).normalize()
    const side = random() > 0.5 ? 1 : -1
    const center = camera.position.clone().addScaledVector(forward, SHOOT_DIST)
    const start = center
      .clone()
      .addScaledVector(right, -side * SHOOT_HALF_WIDTH)
      .addScaledVector(up, 60 + random() * 90)
    const dir = right
      .clone()
      .multiplyScalar(side)
      .addScaledVector(up, -0.3)
      .normalize()
    const travel = SHOOT_HALF_WIDTH * 2
    const startedAt = performance.now()
    shootingStar.visible = true

    function step() {
      const t = (performance.now() - startedAt) / SHOOT_LIFE_MS
      if (t >= 1) {
        shootingStar.visible = false
        shootMaterial.opacity = 0
        shootRaf = 0
        scheduleShoot()
        return
      }
      const head = start.clone().addScaledVector(dir, travel * t)
      const pos = shootGeometry.getAttribute(
        'position',
      ) as THREE.BufferAttribute
      for (let i = 0; i < TRAIL_POINTS; i++) {
        const p = head
          .clone()
          .addScaledVector(dir, -SHOOT_TRAIL_LEN * (i / (TRAIL_POINTS - 1)))
        pos.setXYZ(i, p.x, p.y, p.z)
      }
      pos.needsUpdate = true
      shootMaterial.opacity = Math.sin(t * Math.PI)
      shootRaf = requestAnimationFrame(step)
    }
    step()
  }

  // Pointer parallax: tilt the background toward the cursor.
  let targetX = 0
  let targetY = 0
  let parallaxRaf = 0

  function tick() {
    group.rotation.x += (targetX - group.rotation.x) * PARALLAX_EASE
    group.rotation.y += (targetY - group.rotation.y) * PARALLAX_EASE
    const settled =
      Math.abs(targetX - group.rotation.x) < 0.0004 &&
      Math.abs(targetY - group.rotation.y) < 0.0004
    parallaxRaf = settled ? 0 : requestAnimationFrame(tick)
  }

  function setPointer(nx: number, ny: number) {
    targetY = nx * PARALLAX_MAX
    targetX = ny * PARALLAX_MAX
    if (!parallaxRaf) parallaxRaf = requestAnimationFrame(tick)
  }

  function setDark(next: boolean) {
    dark = next
    for (const layer of stars) layer.visible = next
    sphereGrid.visible = !next
    clearTimeout(shootTimer)
    if (next) {
      scheduleShoot()
    } else {
      cancelAnimationFrame(shootRaf)
      shootRaf = 0
      shootingStar.visible = false
    }
  }

  setDark(initialDark)

  function dispose() {
    cancelAnimationFrame(parallaxRaf)
    cancelAnimationFrame(shootRaf)
    clearTimeout(shootTimer)
    scene.remove(group)
    scene.remove(shootingStar)
    texture.dispose()
    shootGeometry.dispose()
    shootMaterial.dispose()
    for (const layer of [...stars, sphereGrid]) {
      layer.geometry.dispose()
      ;(layer.material as THREE.Material).dispose()
    }
  }

  return { setDark, setPointer, dispose }
}
