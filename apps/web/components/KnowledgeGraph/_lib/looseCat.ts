'use client'

import { useSyncExternalStore } from 'react'

/*
  Tiny SSR-safe store for the "loose cat" flag, persisted in localStorage.

  Once the easter egg is triggered the cat keeps drifting across refreshes until
  the user clicks it away. The wrapper that owns the cat is server-rendered, so a
  plain localStorage read in render would break hydration - useSyncExternalStore
  gives a stable server snapshot (false) and the real value on the client.
*/
const CAT_KEY = 'indexfolio-loose-cat'
const listeners = new Set<() => void>()

function read(): boolean {
  try {
    return localStorage.getItem(CAT_KEY) === '1'
  } catch {
    return false
  }
}

export function setLooseCat(loose: boolean) {
  try {
    if (loose) localStorage.setItem(CAT_KEY, '1')
    else localStorage.removeItem(CAT_KEY)
  } catch {
    // storage unavailable - the cat just won't persist
  }
  for (const listener of listeners) listener()
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function useLooseCat(): boolean {
  return useSyncExternalStore(subscribe, read, () => false)
}
