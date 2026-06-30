import { useEffect, useMemo, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { AstronautCat } from '@/components/icons/AstronautCat'
import { random } from '@/lib/random'

/*
  Interactive astronaut cat: drifts in from off the left edge, wanders the
  screen on a slow looping path, and on click shoots off and calls onLeave.
  Roam bounds (area) come from the parent.
*/
type FloatingCatProps = {
  size?: number
  area: { width: number; height: number }
  onLeave?: () => void
}

const MARGIN_X = 120
const MARGIN_TOP = 150
const MARGIN_BOTTOM = 150
const WAYPOINTS = 6
// slow drift in from off-screen
const ENTER_DURATION = 6
// slow loop across the screen
const WANDER_DURATION = 80

export function FloatingCat({ size = 80, area, onLeave }: FloatingCatProps) {
  const controls = useAnimationControls()
  const [leaving, setLeaving] = useState(false)

  // Screen-spanning path the cat wanders (mirrored, so it loops back and forth).
  const path = useMemo(() => {
    const rangeX = Math.max(1, area.width - MARGIN_X * 2)
    const rangeY = Math.max(1, area.height - MARGIN_TOP - MARGIN_BOTTOM)
    // Deterministic meander (sine/cos with irrational steps) avoids an impure
    // Math.random in render.
    const points = Array.from({ length: WAYPOINTS }, (_, i) => ({
      x: MARGIN_X + ((Math.sin(i * 2.39967) + 1) / 2) * rangeX,
      y: MARGIN_TOP + ((Math.cos(i * 1.61803) + 1) / 2) * rangeY,
    }))
    return {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      first: points[0] ?? { x: area.width / 2, y: area.height / 2 },
    }
  }, [area.width, area.height])

  useEffect(() => {
    let cancelled = false
    async function enter() {
      await controls.start({
        x: path.first.x,
        y: path.first.y,
        opacity: [0, 1],
        transition: { duration: ENTER_DURATION, ease: 'easeOut' },
      })
      if (cancelled) return
      controls.start({
        x: path.x,
        y: path.y,
        rotate: [0, 6, -5, 4, -6, 0],
        transition: {
          duration: WANDER_DURATION,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
      })
    }
    enter()
    return () => {
      cancelled = true
    }
  }, [controls, path])

  async function release() {
    if (leaving) return
    setLeaving(true)
    // Shoot off from current position (null = current value), spinning + fading.
    const angle = random() * Math.PI * 2
    await controls.start({
      x: [null, Math.cos(angle) * 2200],
      y: [null, Math.sin(angle) * 2200],
      rotate: [null, 900],
      scale: [null, 0.3],
      opacity: [null, 0],
      transition: { duration: 1.6, ease: 'easeIn' },
    })
    onLeave?.()
  }

  return (
    <motion.button
      type="button"
      onClick={release}
      aria-label="Release the astronaut cat"
      className="pointer-events-auto absolute left-0 top-0 cursor-pointer"
      initial={{ x: -150, y: area.height / 2, opacity: 0 }}
      animate={controls}
    >
      {/* Thruster fire - bursts on release */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-full -mt-1 h-10 w-3 -translate-x-1/2 origin-top rounded-full"
        style={{
          background:
            'linear-gradient(to bottom, #635bff, rgba(99,91,255,0.6), transparent)',
          filter: 'blur(1px)',
        }}
        animate={
          leaving
            ? { opacity: [0, 1, 0.85, 1, 0], scaleY: [0.3, 1.7, 1.1, 1.9, 0.4] }
            : { opacity: 0, scaleY: 0.3 }
        }
        transition={
          leaving
            ? { duration: 1.6, ease: 'easeOut', times: [0, 0.12, 0.4, 0.7, 1] }
            : { duration: 0.3 }
        }
      />
      <AstronautCat size={size} />
    </motion.button>
  )
}
