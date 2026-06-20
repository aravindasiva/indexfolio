'use client'

import { useSyncExternalStore } from 'react'

/*
  Decides whether to render the 3D graph or the lightweight 2D fallback.
  3D (three.js) is heavy, so we fall back when WebGL is unavailable, the user
  prefers reduced motion, or the screen is small.

  useSyncExternalStore keeps it SSR-safe: the server renders 'loading' (caller
  renders nothing for that tick), then the client resolves the real mode. The
  result never changes within a session, so it is computed once and cached.
*/
export type GraphMode = 'loading' | '2d' | '3d'

let resolved: Exclude<GraphMode, 'loading'> | null = null

function getSnapshot(): GraphMode {
  if (resolved) return resolved
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const smallScreen = matchMedia('(max-width: 768px)').matches
  let hasWebGL = false
  try {
    hasWebGL = Boolean(document.createElement('canvas').getContext('webgl'))
  } catch {
    hasWebGL = false
  }
  resolved = hasWebGL && !reducedMotion && !smallScreen ? '3d' : '2d'
  return resolved
}

function subscribe(): () => void {
  return () => {}
}

export function useGraphMode(): GraphMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'loading')
}
