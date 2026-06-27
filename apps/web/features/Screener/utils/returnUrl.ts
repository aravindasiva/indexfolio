const KEY = 'indexfolio:screener-return'

// Remember the screener's URL (with its filters) so a detail page can return to
// the exact results the user was viewing - even after hopping detail-to-detail
// via related ETFs. Stored in sessionStorage; no-ops on the server.
export function rememberScreenerReturn(url: string): void {
  globalThis.sessionStorage?.setItem(KEY, url)
}

export function getScreenerReturn(): string {
  return globalThis.sessionStorage?.getItem(KEY) ?? '/screener'
}
