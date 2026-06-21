'use client'

import { useEffect, useRef } from 'react'

/*
  Fires onUnlock when the Konami code is typed: up up down down left right left
  right b a. Reusable for any easter egg. Ignores keystrokes while typing in a
  field so it never interferes with real input.
*/
const SEQUENCE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
] as const

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function useKonamiCode(onUnlock: () => void) {
  const callbackRef = useRef(onUnlock)
  useEffect(() => {
    callbackRef.current = onUnlock
  }, [onUnlock])

  useEffect(() => {
    let index = 0
    function onKeyDown(event: KeyboardEvent) {
      if (isTyping(event.target)) return
      const key = event.key.toLowerCase()
      if (key === SEQUENCE[index]) {
        index += 1
        if (index === SEQUENCE.length) {
          index = 0
          callbackRef.current()
        }
      } else {
        // Reset, but let a fresh first key start a new attempt.
        index = key === SEQUENCE[0] ? 1 : 0
      }
    }
    globalThis.addEventListener('keydown', onKeyDown)
    return () => globalThis.removeEventListener('keydown', onKeyDown)
  }, [])
}
