'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { nodes as graphNodes } from '@indexfolio/knowledge-graph'
import { KnowledgeGraph2D } from './KnowledgeGraph2D'
import { useGraphMode } from './_lib/useGraphMode'
import { useKonamiCode } from './_lib/useKonamiCode'
import { useLooseCat, setLooseCat } from './_lib/looseCat'
import { SUPERNOVA_EVENT, SUPERNOVA_DURATION_MS } from './_lib/supernova'
import { ParticleBurst } from './_components/ParticleBurst'
import { FloatingCat } from '@/components/FloatingCat/FloatingCat'

// The 3D graph pulls in three.js, so it is lazy-loaded (and client-only). It is
// only fetched when the device can actually use it - the 2D fallback ships in
// the main bundle.
const KnowledgeGraph3D = dynamic(
  () => import('./KnowledgeGraph3D').then((m) => m.KnowledgeGraph3D),
  { ssr: false },
)

type KnowledgeGraphProps = { mode: 'hero' | 'overlay' }

// Mobile has no keyboard, so the Konami code is unreachable. The secret there is
// tapping the centre (home) node five times in quick succession.
const HOME_TAP_TARGET = 5
const HOME_TAP_WINDOW = 2000

export function KnowledgeGraph({ mode }: KnowledgeGraphProps) {
  const graphMode = useGraphMode()

  // The easter egg lives here (not in either graph) so it fires the same way for
  // 3D, 2D, desktop, and mobile. The graphs just report the secret trigger via
  // onHomeActivate and (on 3D) explode in response to the supernova event.
  const looseCat = useLooseCat()
  const [burst, setBurst] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ width: 0, height: 0 })

  // Tap counting is kept in refs so each tap doesn't re-render the graph.
  const tapCount = useRef(0)
  const lastTap = useRef(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect)
        setDims({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fireEgg = useCallback(() => {
    // Already loose: do nothing until the user clicks the cat away.
    if (looseCat) return
    setBurst(true)
    setLooseCat(true)
    // Keep the burst mounted until the graph has eased back into place.
    globalThis.setTimeout(() => setBurst(false), SUPERNOVA_DURATION_MS)
    // The 3D graph listens for this and blasts itself apart (2D just ignores it).
    globalThis.dispatchEvent(new Event(SUPERNOVA_EVENT))
  }, [looseCat])

  useKonamiCode(fireEgg)

  // Five quick taps on the home node = the same secret, for touch devices.
  const handleHomeActivate = useCallback(() => {
    const now = Date.now()
    tapCount.current =
      now - lastTap.current < HOME_TAP_WINDOW ? tapCount.current + 1 : 1
    lastTap.current = now
    if (tapCount.current >= HOME_TAP_TARGET) {
      tapCount.current = 0
      fireEgg()
    }
  }, [fireEgg])

  const handleCatLeave = useCallback(() => {
    setLooseCat(false)
  }, [])

  return (
    <>
      {/* The visual graph is decorative; this is the real navigable map for
          screen readers and crawlers. Rendered regardless of 2D/3D. */}
      <nav aria-label="Explore Indexfolio" className="sr-only">
        <ul>
          {graphNodes.map((node) => (
            <li key={node.id}>
              <a href={node.href}>{node.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={containerRef} className="relative">
        {graphMode === '3d' && (
          <KnowledgeGraph3D mode={mode} onHomeActivate={handleHomeActivate} />
        )}
        {graphMode === '2d' && (
          <KnowledgeGraph2D mode={mode} onHomeActivate={handleHomeActivate} />
        )}
        {/* graphMode === 'loading' renders nothing for one tick while we detect
            capability, avoiding a 2D-to-3D flash. */}

        {/* Easter egg: supernova flash + particle burst */}
        {burst && (
          <>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(99,91,255,0.55), transparent 60%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{
                duration: 0.8,
                times: [0, 0.2, 1],
                ease: 'easeOut',
              }}
            />
            <ParticleBurst />
          </>
        )}

        {/* The cat drifts in, wanders the screen, and stays (across refreshes)
            until you click it away. */}
        {looseCat && dims.width > 0 && (
          <div className="pointer-events-none absolute inset-0 z-30">
            <FloatingCat size={80} area={dims} onLeave={handleCatLeave} />
          </div>
        )}
      </div>
    </>
  )
}
