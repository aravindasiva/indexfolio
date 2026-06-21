'use client'

import { motion } from 'framer-motion'
import { SUPERNOVA_DURATION_MS } from '../_lib/supernova'

/*
  One-shot particle explosion from the centre of the graph (the supernova).
  A shockwave ring leads the blast and the debris lingers and fades over the
  whole effect, so it clears just as the graph eases back into place. Indigo
  shades so it reads on both themes. Mounted on trigger, plays once.
*/
const TOTAL_S = SUPERNOVA_DURATION_MS / 1000

const PARTICLES = Array.from({ length: 56 }, (_, id) => {
  const angle = Math.random() * Math.PI * 2
  const distance = 260 + Math.random() * 460
  return {
    id,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 2 + Math.random() * 5,
    // Spread across most of the effect so the debris fades as the graph settles.
    duration: TOTAL_S * (0.5 + Math.random() * 0.45),
    bright: Math.random() > 0.5,
  }
})

export function ParticleBurst() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
    >
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.bright ? '#8b87ff' : '#635bff',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1.4 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: p.duration, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
