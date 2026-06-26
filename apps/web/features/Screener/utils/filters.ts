'use client'

import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
  type inferParserType,
} from 'nuqs'
import type { EtfListParams } from '@/lib/api'

export const SORT_FIELDS = [
  'ter',
  'fundSizeEur',
  'inceptionDate',
  'ticker',
  'name',
] as const
export type SortField = (typeof SORT_FIELDS)[number]

/*
  The screener's filter state lives in the URL (shareable, bookmarkable). nuqs
  clears any value equal to its default, so the default view = a clean URL.
  maxTer is held as a percent here (what the slider shows); the API wants a
  fraction, so filtersToParams divides by 100.
*/
export const filterParsers = {
  search: parseAsString.withDefault(''),
  assetClass: parseAsString.withDefault(''),
  type: parseAsStringEnum(['acc', 'dist']),
  domicile: parseAsArrayOf(parseAsString).withDefault([]),
  exchange: parseAsArrayOf(parseAsString).withDefault([]),
  maxTer: parseAsFloat,
  minFundSize: parseAsInteger,
  sort: parseAsStringEnum([
    'ter',
    'fundSizeEur',
    'inceptionDate',
    'ticker',
    'name',
  ]).withDefault('fundSizeEur'),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc'),
  page: parseAsInteger.withDefault(1),
}

export type ScreenerFilters = inferParserType<typeof filterParsers>

export function useScreenerFilters() {
  return useQueryStates(filterParsers)
}

export type SetScreenerFilters = ReturnType<typeof useScreenerFilters>[1]

function typeToAccumulating(
  type: ScreenerFilters['type'],
): boolean | undefined {
  if (type === 'acc') return true
  if (type === 'dist') return false
  return undefined
}

// True when any narrowing filter is set (sort/order/page do not count). Used to
// tell "no ETFs match your filters" apart from "no data yet".
export function hasActiveFilters(f: ScreenerFilters): boolean {
  return Boolean(
    f.search.trim() ||
    f.assetClass ||
    f.type ||
    f.domicile.length ||
    f.exchange.length ||
    f.maxTer != null ||
    f.minFundSize != null,
  )
}

// Map the URL filter state to the API query params.
export function filtersToParams(filters: ScreenerFilters): EtfListParams {
  return {
    page: filters.page,
    search: filters.search.trim() || undefined,
    assetClass: filters.assetClass || undefined,
    isAccumulating: typeToAccumulating(filters.type),
    domicile: filters.domicile.length ? filters.domicile.join(',') : undefined,
    exchange: filters.exchange.length ? filters.exchange.join(',') : undefined,
    // Percent -> fraction. The API requires a positive value, so 0 is dropped.
    maxTer:
      filters.maxTer != null && filters.maxTer > 0
        ? filters.maxTer / 100
        : undefined,
    minFundSize:
      filters.minFundSize != null ? String(filters.minFundSize) : undefined,
    sort: filters.sort,
    order: filters.order,
  }
}
