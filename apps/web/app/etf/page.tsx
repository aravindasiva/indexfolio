import { redirect } from 'next/navigation'
import { getAllEtfs } from '@/lib/api'
import { REVALIDATE } from '@/features/EtfDetail/utils/loader'
import { pick } from '@/lib/random'

// Re-roll the random fund on every request rather than baking one pick (or the
// API-down fallback) at build time.
export const dynamic = 'force-dynamic'

// /etf has no listing of its own - the screener is the browse UI. Treat the bare
// route as "feeling lucky" and send curious visitors to a random fund, falling
// back to the screener if the catalogue can't be reached.
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
