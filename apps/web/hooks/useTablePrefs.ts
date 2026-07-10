'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { TableView } from '@/components/ViewToggle/ViewToggle'
import type { Density } from '@/components/DensityToggle/DensityToggle'

export type TablePrefs = {
  view: TableView
  density: Density
  hiddenColumns: string[]
}

// Density is global (one choice everywhere); view + hidden columns are per-table.
const DENSITY_KEY = 'indexfolio.table.density'
const tableKey = (id: string) => `indexfolio.table.${id}`
// Same-tab writes don't fire the native 'storage' event, so we broadcast our own.
const CHANGE_EVENT = 'indexfolio:table-prefs'

const DEFAULT_PREFS: TablePrefs = {
  view: 'table',
  density: 'comfortable',
  hiddenColumns: [],
}

function safeGet(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null
  } catch {
    return null
  }
}

function parse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value))
    globalThis.dispatchEvent(new Event(CHANGE_EVENT))
  } catch {
    // Private mode / no storage - preferences just do not persist.
  }
}

function subscribe(onChange: () => void): () => void {
  globalThis.addEventListener('storage', onChange)
  globalThis.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    globalThis.removeEventListener('storage', onChange)
    globalThis.removeEventListener(CHANGE_EVENT, onChange)
  }
}

// getSnapshot must return a stable reference while storage is unchanged, or useSyncExternalStore
// loops. Cache the parsed prefs per table, keyed on the raw strings they came from.
type Cache = {
  perTableRaw: string | null
  densityRaw: string | null
  defaults: TablePrefs
  value: TablePrefs
}
const cache = new Map<string, Cache>()

// `defaults` is part of the key (by reference): it feeds the fallback, so a new one must recompute.
function snapshot(tableId: string, defaults: TablePrefs): TablePrefs {
  const perTableRaw = safeGet(tableKey(tableId))
  const densityRaw = safeGet(DENSITY_KEY)
  const cached = cache.get(tableId)
  if (
    cached &&
    cached.perTableRaw === perTableRaw &&
    cached.densityRaw === densityRaw &&
    cached.defaults === defaults
  ) {
    return cached.value
  }
  const perTable =
    parse<Pick<TablePrefs, 'view' | 'hiddenColumns'>>(perTableRaw)
  const density = parse<Density>(densityRaw)
  const value: TablePrefs = {
    view: perTable?.view ?? defaults.view,
    hiddenColumns: perTable?.hiddenColumns ?? defaults.hiddenColumns,
    density: density ?? defaults.density,
  }
  cache.set(tableId, { perTableRaw, densityRaw, defaults, value })
  return value
}

// Table chrome in localStorage, not the URL - it doesn't change the result set, so it shouldn't leak
// into a shared link. useSyncExternalStore keeps it SSR-safe and in sync across tabs.
export function useTablePrefs(tableId: string, defaults?: Partial<TablePrefs>) {
  const merged = useMemo<TablePrefs>(
    () => (defaults ? { ...DEFAULT_PREFS, ...defaults } : DEFAULT_PREFS),
    [defaults],
  )

  const prefs = useSyncExternalStore(
    subscribe,
    () => snapshot(tableId, merged),
    () => merged,
  )

  const setView = useCallback(
    (view: TableView) =>
      write(tableKey(tableId), { view, hiddenColumns: prefs.hiddenColumns }),
    [tableId, prefs.hiddenColumns],
  )

  const setDensity = useCallback(
    (density: Density) => write(DENSITY_KEY, density),
    [],
  )

  const setHiddenColumns = useCallback(
    (hiddenColumns: string[]) =>
      write(tableKey(tableId), { view: prefs.view, hiddenColumns }),
    [tableId, prefs.view],
  )

  const toggleColumn = useCallback(
    (id: string) => {
      const hiddenColumns = prefs.hiddenColumns.includes(id)
        ? prefs.hiddenColumns.filter((c) => c !== id)
        : [...prefs.hiddenColumns, id]
      write(tableKey(tableId), { view: prefs.view, hiddenColumns })
    },
    [tableId, prefs.view, prefs.hiddenColumns],
  )

  return { prefs, setView, setDensity, setHiddenColumns, toggleColumn }
}
