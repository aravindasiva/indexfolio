import { redirect } from 'next/navigation'
import { getAllEtfs } from '@/lib/api'
import { REVALIDATE } from '@/features/EtfDetail/utils/loader'
import { pick } from '@/lib/random'

// Re-roll the random fund per request rather than baking one pick (or the
// API-down fallback) at build time.
export const dynamic = 'force-dynamic'

// /etf has no listing of its own; treat it as "feeling lucky" and send visitors
// to a random fund, falling back to the screener if the catalogue is unreachable.
async function pickEtfPath(): Promise<string> {
  try {
    const etfs = await getAllEtfs({ revalidate: REVALIDATE })
    if (etfs.length === 0) return '/screener'
    return `/etf/${pick(etfs).ticker}`
  } catch {
    return '/screener'
  }
}

export default async function EtfIndex() {
  // redirect() throws internally, so it must run outside the try/catch above.
  redirect(await pickEtfPath())
}
