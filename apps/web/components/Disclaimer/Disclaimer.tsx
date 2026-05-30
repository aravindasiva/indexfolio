'use client'

import { useState, useSyncExternalStore } from 'react'
import type { FocusEvent, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { CircleAlert, X } from 'lucide-react'
import { ToolTip } from '@/components/ToolTip/ToolTip'

const SESSION_KEY = 'indexfolio-disclaimer-dismissed'
const WAIT_BEFORE_DISMISS_MS = 2500

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
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipAnchorRect, setTooltipAnchorRect] = useState<DOMRect | null>(
    null,
  )
  const [isHoldingToUnlock, setIsHoldingToUnlock] = useState(false)
  const [canDismiss, setCanDismiss] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  function startUnlockHold(
    event: MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>,
  ) {
    setTooltipVisible(true)
    setTooltipAnchorRect(event.currentTarget.getBoundingClientRect())
    if (canDismiss) return
    setIsHoldingToUnlock(true)
  }

  function resetUnlockHold() {
    setTooltipVisible(false)
    // Always fully reset regardless of canDismiss state.
    // Closing must be intentional: the user has to hover AND click within
    // the same hover session. Moving away cancels and requires starting over.
    setIsHoldingToUnlock(false)
    setCanDismiss(false)
    setProgressKey((prev) => prev + 1)
  }

  function handleUnlockAnimationComplete() {
    if (!isHoldingToUnlock) return
    setCanDismiss(true)
    setIsHoldingToUnlock(false)
  }

  function closeDisclaimer() {
    if (!canDismiss) return
    try {
      globalThis.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Ignore storage write errors and still hide locally.
    }
    setDismissedLocally(true)
  }

  if (dismissedInSession || dismissedLocally) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-4">
      <div className="glass-surface pointer-events-auto relative inline-flex w-auto max-w-[92vw] items-center gap-2 rounded-full px-4 py-2">
        <p className="max-w-[54ch] text-center text-xs font-normal italic leading-5 text-foreground/78 whitespace-normal wrap-break-word">
          <span className="inline-flex items-center gap-1">
            <CircleAlert size={12} />
            Nothing here is financial advice. Always do your own research.
          </span>
        </p>

        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Dismiss disclaimer"
            aria-disabled={!canDismiss}
            onClick={closeDisclaimer}
            onMouseEnter={startUnlockHold}
            onMouseLeave={resetUnlockHold}
            onFocus={startUnlockHold}
            onBlur={resetUnlockHold}
            className="glass-chip inline-flex size-6 items-center justify-center rounded-full transition-all duration-150 hover:scale-[1.03] hover:text-foreground aria-disabled:opacity-70"
          >
            {canDismiss ? null : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -rotate-90"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="1.6"
                />
                <motion.circle
                  key={progressKey}
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isHoldingToUnlock ? 1 : 0 }}
                  transition={{
                    duration: WAIT_BEFORE_DISMISS_MS / 1000,
                    ease: 'linear',
                  }}
                  onAnimationComplete={handleUnlockAnimationComplete}
                  className="text-primary dark:text-foreground"
                />
              </svg>
            )}
            <X size={12} strokeWidth={2.5} />
          </button>

          <ToolTip
            text="Yes, I understand 💜"
            isVisible={tooltipVisible}
            anchorRect={tooltipAnchorRect}
            placement="auto"
            offset={16}
          />
        </div>
      </div>
    </div>
  )
}
