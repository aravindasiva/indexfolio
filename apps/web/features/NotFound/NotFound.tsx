'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useAnimationControls } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { AstronautCat } from '@/components/icons/AstronautCat'
import { buildBalloonFlight } from '@/components/FloatingCat/utils/balloonFlight'
import { pick } from '@/lib/random'

// Deterministic so server and client render the same stars (no hydration drift).
const STARS = [
  { top: '12%', left: '18%', size: 2, delay: 0 },
  { top: '22%', left: '72%', size: 1.5, delay: 0.6 },
  { top: '30%', left: '40%', size: 1, delay: 1.2 },
  { top: '18%', left: '88%', size: 2.5, delay: 0.3 },
  { top: '44%', left: '10%', size: 1.5, delay: 0.9 },
  { top: '52%', left: '82%', size: 2, delay: 1.5 },
  { top: '64%', left: '26%', size: 1, delay: 0.4 },
  { top: '72%', left: '60%', size: 1.5, delay: 1.1 },
  { top: '80%', left: '14%', size: 2, delay: 0.7 },
  { top: '38%', left: '64%', size: 1, delay: 1.8 },
  { top: '8%', left: '52%', size: 1.5, delay: 1.4 },
  { top: '86%', left: '78%', size: 1, delay: 0.2 },
  { top: '58%', left: '46%', size: 1.5, delay: 2 },
  { top: '26%', left: '6%', size: 1, delay: 1.6 },
] as const

// Off-screen corners the cat drifts back in from.
const CORNERS = [
  { x: -360, y: 260 },
  { x: 360, y: 260 },
  { x: -360, y: -160 },
  { x: 360, y: -160 },
]

const ROPE_A = 'M128 6 C 92 24, 78 6, 50 40 C 30 64, 16 48, 2 84'
const ROPE_B = 'M128 12 C 90 16, 82 18, 50 34 C 26 56, 20 58, 2 78'

export function NotFound() {
  const cat = useAnimationControls()
  const [launching, setLaunching] = useState(false)

  useEffect(() => {
    cat.start('idle')
  }, [cat])

  async function boop() {
    if (launching) return
    setLaunching(true)

    // Released like a balloon: spirals off in a random direction, spinning.
    await cat.start({
      ...buildBalloonFlight(),
      transition: { duration: 1.9, ease: 'easeIn' },
    })

    // Drift back in gradually from a random corner.
    const corner = pick(CORNERS)
    cat.set({ ...corner, rotate: -25, scale: 0.5, opacity: 0 })
    await cat.start({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 1.9, ease: 'easeOut' },
    })

    setLaunching(false)
    cat.start('idle')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-28 text-center">
      {/* Ambient glow (works in both themes) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[130px]" />
      </div>

      {/* Stars (foreground colour, so they adapt to the theme) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {STARS.map((star) => (
          <motion.span
            key={`${star.top}-${star.left}`}
            className="absolute rounded-full bg-foreground"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.12, 0.5, 0.12] }}
            transition={{
              duration: 3,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Scene: a lone node, and the cat that drifted off it on a frayed rope */}
      <div className="relative mb-12 h-44 w-full max-w-lg">
        {/* The node it came from, with its own cut rope reaching toward the cat */}
        <motion.div
          className="absolute left-[14%] top-[50%]"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            width="90"
            height="70"
            viewBox="0 0 90 70"
            fill="none"
            className="overflow-visible"
          >
            <motion.path
              animate={{
                d: [
                  'M10 58 C 34 44, 46 34, 72 12',
                  'M10 58 C 32 48, 50 40, 72 16',
                  'M10 58 C 34 44, 46 34, 72 12',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
            <circle
              cx="10"
              cy="58"
              r="11"
              fill="var(--primary)"
              fillOpacity="0.22"
            />
            <circle cx="10" cy="58" r="5" fill="var(--primary)" />
          </svg>
        </motion.div>

        {/* The lost astronaut cat - tap to release it like a balloon */}
        <motion.button
          type="button"
          onClick={boop}
          aria-label="Release the astronaut cat"
          className="absolute left-[52%] top-2 cursor-pointer text-foreground"
          variants={{
            idle: {
              x: [0, 16, -12, 0],
              y: [0, -18, 10, 0],
              rotate: [0, 5, -4, 0],
              scale: 1,
              opacity: 1,
              transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
            },
          }}
          animate={cat}
        >
          {/* Frayed rope, gently swaying, trailing toward the node */}
          <svg
            width="130"
            height="90"
            viewBox="0 0 130 90"
            fill="none"
            className="pointer-events-none absolute right-full top-1/2 -mr-1"
          >
            <motion.path
              animate={{ d: [ROPE_A, ROPE_B, ROPE_A] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 7"
            />
          </svg>

          {/* Thruster fire - bursts when released */}
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-full -mt-1 h-10 w-3 -translate-x-1/2 origin-top rounded-full"
            style={{
              background:
                'linear-gradient(to bottom, #635bff, rgba(99,91,255,0.6), transparent)',
              filter: 'blur(1px)',
            }}
            animate={
              launching
                ? {
                    opacity: [0, 1, 0.85, 1, 0],
                    scaleY: [0.3, 1.7, 1.1, 1.9, 0.4],
                  }
                : { opacity: 0, scaleY: 0.3 }
            }
            transition={
              launching
                ? {
                    duration: 1.9,
                    ease: 'easeOut',
                    times: [0, 0.12, 0.4, 0.7, 1],
                  }
                : { duration: 0.3 }
            }
          />

          <AstronautCat size={104} />
        </motion.button>
      </div>

      {/* Copy */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        404 · off the graph
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        You&apos;ve drifted off the graph.
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground">
        This node isn&apos;t connected to anything, and it&apos;s not in the
        index. Let&apos;s get you back.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground no-underline transition hover:brightness-110"
      >
        <ArrowLeft size={16} />
        Back to the graph
      </Link>
    </main>
  )
}
