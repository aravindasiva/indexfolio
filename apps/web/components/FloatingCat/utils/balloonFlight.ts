/*
  Keyframes for releasing the astronaut cat like a balloon: spirals off in a
  random direction, spinning and shrinking, then fades. Shared by the 404 page
  and the Konami easter egg to keep the motion consistent.
*/
import { random } from '@/lib/random'

export type BalloonFlight = {
  x: number[]
  y: number[]
  rotate: number[]
  scale: number[]
  opacity: number[]
}

export function buildBalloonFlight(): BalloonFlight {
  const angle = random() * Math.PI * 2
  const [dirX, dirY] = [Math.cos(angle), Math.sin(angle)]
  const [perpX, perpY] = [-dirY, dirX]
  const distance = 840
  const steps = 6
  const x: number[] = []
  const y: number[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const along = distance * t
    const wobble = Math.sin(t * Math.PI * 3) * 80 * (1 - t)
    x.push(dirX * along + perpX * wobble)
    y.push(dirY * along + perpY * wobble)
  }
  return {
    x,
    y,
    rotate: [0, 180, 360, 560, 760, 920, 1080],
    scale: [1, 0.96, 0.9, 0.78, 0.62, 0.45, 0.3],
    opacity: [1, 1, 1, 1, 0.8, 0.4, 0],
  }
}
