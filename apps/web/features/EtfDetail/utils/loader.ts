import { getAllEtfs, getEtfByTicker, getEtfs, type Etf } from '@/lib/api'
import { selectRelated } from './relatedEtfs'

// Known tickers are pre-rendered (SSG) and refreshed hourly (ISR); any other
// ticker renders on-demand (dynamicParams), so new ETFs work without a rebuild.
export const REVALIDATE = 3600

const RELATED_LIMIT = 6
const POOL_LIMIT = 100

// Every known ticker, for generateStaticParams. Resilient if the API is empty/down.
export async function getEtfTickers(): Promise<string[]> {
  try {
    const etfs = await getAllEtfs({ revalidate: REVALIDATE })
    return etfs.map((etf) => etf.ticker)
  } catch {
    return []
  }
}

// The API uppercases the ticker, so /etf/iwda resolves to IWDA.
export async function loadEtf(ticker: string): Promise<Etf | null> {
  try {
    return await getEtfByTicker(ticker, { revalidate: REVALIDATE })
  } catch {
    return null
  }
}

// Pool the same asset class, then narrow to same-index-first related funds.
export async function loadRelated(etf: Etf): Promise<Etf[]> {
  try {
    const pool = await getEtfs(
      { assetClass: etf.assetClass, limit: POOL_LIMIT },
      { revalidate: REVALIDATE },
    )
    return selectRelated(etf, pool.data, RELATED_LIMIT)
  } catch {
    return []
  }
}
