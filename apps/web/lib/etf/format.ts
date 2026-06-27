// Display formatting for ETF fields. Pure, trivially testable. Shared by the
// screener and the detail page.

// TER comes from the API as a fraction (e.g. 0.0022 means 0.22%).
export function formatTer(ter: number): string {
  return `${(ter * 100).toFixed(2)}%`
}

// fundSizeEur arrives as a euro amount in a string (it is a bigint on the API).
export function formatFundSize(eur: string): string {
  const value = Number(eur)
  if (!Number.isFinite(value) || value <= 0) return '-'
  if (value >= 1e9) return `€${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `€${Math.round(value / 1e6)}M`
  if (value >= 1e3) return `€${Math.round(value / 1e3)}K`
  return `€${value}`
}

export function fundTypeLabel(isAccumulating: boolean): string {
  return isAccumulating ? 'Acc' : 'Dist'
}
