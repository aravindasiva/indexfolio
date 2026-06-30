import type { TagTone } from '@/components/Tag/Tag'

const ASSET_CLASS_LABELS: Record<string, string> = {
  EQUITY: 'Equity',
  BOND: 'Bond',
  REAL_ESTATE: 'Real estate',
}

export function assetClassLabel(value: string): string {
  return ASSET_CLASS_LABELS[value] ?? value
}

const ASSET_TONES: Record<string, TagTone> = {
  EQUITY: 'indigo',
  BOND: 'amber',
  REAL_ESTATE: 'emerald',
}

export function assetTone(value: string): TagTone {
  return ASSET_TONES[value] ?? 'neutral'
}

const PROVIDER_LABELS: Record<string, string> = {
  ISHARES: 'iShares',
  VANGUARD: 'Vanguard',
  AMUNDI: 'Amundi',
  INVESCO: 'Invesco',
  XTRACKERS: 'Xtrackers',
  SPDR: 'SPDR',
  HSBC: 'HSBC',
  AVANTIS: 'Avantis',
}

export function providerLabel(value: string): string {
  return PROVIDER_LABELS[value] ?? value
}

const DOMICILE_LABELS: Record<string, string> = {
  IE: 'Ireland',
  LU: 'Luxembourg',
  DE: 'Germany',
}

export function domicileLabel(value: string): string {
  return DOMICILE_LABELS[value] ?? value
}

// Deliberately qualitative: no hardcoded tax rates (those belong in
// packages/tax-engine, never in UI copy).
export const TYPE_HINT =
  'Accumulating reinvests dividends and defers tax until you sell. Distributing pays dividends out.'
export const DOMICILE_HINT =
  'Irish (IE) domiciled funds qualify for a reduced US dividend withholding rate under the US-Ireland treaty, improving net returns on US holdings.'
