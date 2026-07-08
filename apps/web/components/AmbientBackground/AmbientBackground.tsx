'use client'

import { useEffect, useRef } from 'react'

// Dot-grid backdrop shared across the product. A second dot layer is masked to a soft circle that
// tracks the cursor (only the mask centre moves per frame); skipped for reduced-motion.
export function AmbientBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = spotlightRef.current
    if (!el) return
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return

    let frame = 0
    let x = 0
    let y = 0
    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = globalThis.requestAnimationFrame(() => {
        frame = 0
        el.style.setProperty('--spot-x', `${x}px`)
        el.style.setProperty('--spot-y', `${y}px`)
        el.classList.add('is-active')
      })
    }

    globalThis.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      globalThis.removeEventListener('pointermove', onMove)
      if (frame) globalThis.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="dot-grid absolute inset-0" />
      <div ref={spotlightRef} className="dot-grid-spotlight absolute inset-0" />
    </div>
  )
}
