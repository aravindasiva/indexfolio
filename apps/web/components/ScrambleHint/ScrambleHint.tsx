'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { pick } from '@/lib/random'
import { cn } from '@/lib/utils'

const GLYPHS = '</>{}[]#*+=~?%01'.split('')
const SCRAMBLE_MS = 900
const COOLDOWN_MS = 15000
const TEASE_MS = 3000

// A desktop decoy: on hover the text scrambles and a tooltip teases a secret - a breadcrumb, not the
// real trigger. Hover-only; reduced-motion skips the scramble.
export function ScrambleHint({
  children,
  hint,
  className,
}: {
  children: string
  hint: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  // null = show the real text; a string = mid-scramble. Deriving avoids syncing state to the prop.
  const [scramble, setScramble] = useState<string | null>(null)
  const [teasing, setTeasing] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let lastFired = 0
    let raf = 0
    let hideTimer: ReturnType<typeof setTimeout> | undefined

    const onEnter = () => {
      const now = Date.now()
      if (now - lastFired < COOLDOWN_MS) return
      lastFired = now
      setTeasing(true)
      hideTimer = globalThis.setTimeout(() => setTeasing(false), TEASE_MS)
      if (reduced) return

      const start = now
      const step = () => {
        const elapsed = Date.now() - start
        if (elapsed >= SCRAMBLE_MS) {
          setScramble(null)
          return
        }
        const revealed = Math.floor((elapsed / SCRAMBLE_MS) * children.length)
        setScramble(
          children
            .split('')
            .map((ch, i) => (i < revealed || ch === ' ' ? ch : pick(GLYPHS)))
            .join(''),
        )
        raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }

    el.addEventListener('mouseenter', onEnter)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
      clearTimeout(hideTimer)
    }
  }, [children, reduced])

  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      {scramble ?? children}
      <AnimatePresence>
        {teasing && (
          <motion.span
            aria-hidden="true"
            className="glass-tooltip pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg px-2.5 py-1 text-xs whitespace-nowrap"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {hint}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
