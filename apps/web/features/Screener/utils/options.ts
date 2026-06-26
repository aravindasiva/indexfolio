import type { TagTone } from '@/components/Tag/Tag'

/*
  Fixed presets and labels for the screener toolbar. The dynamic option values
  (domicile/exchange/assetClass) come from the API's /etfs/filters; these are the
  fixed/derived bits that do not.
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

const ASSET_CLASS_LABELS: Record<string, string> = {
  EQUITY: 'Equity',
  BOND: 'Bond',
  REAL_ESTATE: 'Real estate',
}

export function assetClassLabel(value: string): string {
  return ASSET_CLASS_LABELS[value] ?? value
}

// Colour per asset class so the table is scannable at a glance.
const ASSET_TONES: Record<string, TagTone> = {
  EQUITY: 'indigo',
  BOND: 'amber',
  REAL_ESTATE: 'emerald',
}

export function assetTone(value: string): TagTone {
  return ASSET_TONES[value] ?? 'neutral'
}

// General UCITS facts surfaced as tax-aware hints. Deliberately qualitative - no
// hardcoded tax rates (those belong in packages/tax-engine, never in UI copy).
export const TYPE_HINT =
  'Accumulating reinvests dividends and defers tax until you sell. Distributing pays dividends out.'
export const DOMICILE_HINT =
  'Irish (IE) domiciled funds qualify for a reduced US dividend withholding rate under the US-Ireland treaty, improving net returns on US holdings.'
