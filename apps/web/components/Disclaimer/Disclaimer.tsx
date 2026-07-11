'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { ScrambleHint } from '@/components/ScrambleHint/ScrambleHint'

const SESSION_KEY = 'indexfolio-disclaimer-dismissed'
const UNLOCK_DURATION_S = 2.5

function subscribeNoop() {
  return () => {}
}

function readDismissedFromSession(): boolean {
  try {
    return globalThis.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function Disclaimer() {
  const dismissedInSession = useSyncExternalStore(
    subscribeNoop,
    readDismissedFromSession,
    () => true,
  )

  const [dismissedLocally, setDismissedLocally] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  // True on devices with a real pointer; lazy initializer avoids an effect +
  // setState cascade re-render.
  const [requiresHold] = useState(
    () =>
      globalThis.window?.matchMedia('(hover: hover) and (pointer: fine)')
        .matches ?? false,
  )
  // Ref so the animation-complete callback sees the current hover state, avoiding
  // a stale-closure race with pointer-leave.
  const isHoveringRef = useRef(false)

  function startHover() {
    isHoveringRef.current = true
    setIsHovering(true)
  }

  function endHover() {
    isHoveringRef.current = false
    setIsHovering(false)
    setUnlocked(false)
    setProgressKey((k) => k + 1)
  }

  function handleAnimationComplete() {
    if (isHoveringRef.current) setUnlocked(true)
  }

  function dismiss() {
    if (requiresHold && !unlocked) return
    try {
      globalThis.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {}
    setDismissedLocally(true)
  }

  const isDismissed = dismissedInSession || dismissedLocally
  const isClickable = unlocked || !requiresHold

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          key="disclaimer"
          className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="glass-surface pointer-events-auto inline-flex items-center gap-3 rounded-full px-4 py-2">
            <Info size={13} className="shrink-0 text-primary" />
            <p className="max-w-[54ch] text-xs italic leading-5 text-foreground/75">
              Nothing here is financial advice. Always do your{' '}
              <ScrambleHint hint="you're onto something…">
                own research
              </ScrambleHint>
              .
            </p>

            <Tooltip content="Yes, I understand 💜">
              <motion.button
                type="button"
                aria-label="Dismiss disclaimer"
                aria-disabled={!isClickable}
                onClick={dismiss}
                onPointerEnter={requiresHold ? startHover : undefined}
                onPointerLeave={requiresHold ? endHover : undefined}
                onFocus={requiresHold ? startHover : undefined}
                onBlur={requiresHold ? endHover : undefined}
                animate={unlocked ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={[
                  'glass-chip relative inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-opacity',
                  isClickable ? 'cursor-pointer' : 'cursor-default',
                ].join(' ')}
              >
                {requiresHold && !unlocked && (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 size-full -rotate-90"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.25"
                      strokeWidth="2"
                      className="text-primary"
                    />
                    <motion.circle
                      key={progressKey}
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isHovering ? 1 : 0 }}
                      transition={{
                        duration: UNLOCK_DURATION_S,
                        ease: 'linear',
                      }}
                      onAnimationComplete={handleAnimationComplete}
                      className="text-primary"
                    />
                  </svg>
                )}
                <X size={11} strokeWidth={2.5} />
              </motion.button>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
