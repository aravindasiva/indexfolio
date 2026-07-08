import { getEtfByTicker, getEtfs, type Etf } from '@/lib/api'
import { selectRelated } from './relatedEtfs'

// ISR window (seconds) for the surfaces that still cache - the sitemap and the
// /etf redirect. Detail pages render per request (see the page's force-dynamic).
export const REVALIDATE = 3600

const RELATED_LIMIT = 6
const POOL_LIMIT = 100

// The API uppercases the ticker, so /etf/iwda resolves to IWDA.
export async function loadEtf(ticker: string): Promise<Etf | null> {
  try {
    return await getEtfByTicker(ticker)
  } catch {
    return null
  }
}

// Pool the same asset class, then narrow to same-index-first related funds.
export async function loadRelated(etf: Etf): Promise<Etf[]> {
  try {
    const pool = await getEtfs({
      assetClass: etf.assetClass,
      limit: POOL_LIMIT,
    })
    return selectRelated(etf, pool.data, RELATED_LIMIT)
  } catch {
    return []
  }
}
