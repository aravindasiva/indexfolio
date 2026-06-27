/*
  Screener-specific filter presets. Shared ETF labels/tones/hints live in
  lib/etf/labels; the dynamic option values (domicile/exchange/assetClass) come
  from the API's /etfs/filters.
*/

// Fund-size presets map to the API's minFundSize (euros).
export const FUND_SIZE_PRESETS = [
  { label: '>100M', value: 100_000_000 },
  { label: '>500M', value: 500_000_000 },
  { label: '>1B', value: 1_000_000_000 },
  { label: '>5B', value: 5_000_000_000 },
] as const

// TER presets are held as percent (the API gets the fraction; see filtersToParams).
export const TER_PRESETS = [
  { label: '≤0.10%', value: 0.1 },
  { label: '≤0.20%', value: 0.2 },
  { label: '≤0.30%', value: 0.3 },
  { label: '≤0.50%', value: 0.5 },
] as const
