import type { Etf, EtfFilters, EtfListParams, EtfListResponse } from './types'

export type {
  Etf,
  EtfFilters,
  EtfListParams,
  EtfListResponse,
  FilterOption,
} from './types'

/*
  All HTTP to the Indexfolio API lives here. The API is open and owns validation,
  so the frontend just fetches JSON and types it. GET only (no auth/mutations).
  Every call is logged in dev and failures throw a typed ApiError, so callers and
  react-query get consistent, inspectable errors. Add new endpoint functions as
  features need them.
*/

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const isDev = process.env.NODE_ENV !== 'production'

// ─── Types ────────────────────────────────────────────────────────────────────

// An Error with an HTTP status attached - a type + factory, no class needed.
export type ApiError = Error & { status: number }
type Params = Record<string, string | number | boolean | undefined>
// `revalidate` (seconds) opts a server-side call into Next's ISR cache; it is
// ignored by the browser, so client callers can leave it unset.
type GetOptions = { params?: Params; label?: string; revalidate?: number }
type ApiOutcome = { status: number; ms: number } | { error: unknown }

// ─── Functions ──────────────────────────────────────────────────────────────

function apiError(message: string, status: number): ApiError {
  return Object.assign(new Error(message), { name: 'ApiError', status })
}

function buildQuery(params?: Params): string {
  if (!params) return ''
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

// Dev-only request logging, kept out of get() so the fetch logic reads clean.
// Icons make success vs failure easy to spot when scanning the console.
function logApi(name: string, outcome: ApiOutcome) {
  if (!isDev) return
  if ('error' in outcome) {
    console.error(`❌ [api] ${name} -> network error`, outcome.error)
    return
  }
  const line = `[api] ${name} -> ${outcome.status} (${outcome.ms}ms)`
  if (outcome.status >= 200 && outcome.status < 300) console.info(`✅ ${line}`)
  else console.error(`❌ ${line}`)
}

async function get<T>(path: string, options: GetOptions = {}): Promise<T> {
  const { params, label, revalidate } = options
  // A friendly name for logs (e.g. "getEtfList"), falling back to the path.
  const name = label ?? `GET ${path}`

  if (!BASE_URL) throw apiError('NEXT_PUBLIC_API_URL is not set', 0)
  const url = `${BASE_URL}${path}${buildQuery(params)}`

  const init = revalidate === undefined ? undefined : { next: { revalidate } }

  const startedAt = performance.now()
  let response: Response
  try {
    response = await fetch(url, init)
  } catch (error) {
    logApi(name, { error })
    throw apiError(`Network error calling ${path}`, 0)
  }

  const ms = Math.round(performance.now() - startedAt)
  logApi(name, { status: response.status, ms })

  if (!response.ok) {
    throw apiError(`${name} failed (${response.status})`, response.status)
  }

  return response.json() as Promise<T>
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

// `revalidate` is for server callers (detail page, sitemap) that want ISR
// caching; the screener (client) omits it.
type ServerOptions = { revalidate?: number }

export function getEtfs(
  params: EtfListParams = {},
  options: ServerOptions = {},
): Promise<EtfListResponse> {
  return get<EtfListResponse>('/etfs', {
    params,
    label: 'getEtfs',
    revalidate: options.revalidate,
  })
}

export function getEtfByTicker(
  ticker: string,
  options: ServerOptions = {},
): Promise<Etf> {
  return get<Etf>(`/etfs/${ticker}`, {
    label: 'getEtfByTicker',
    revalidate: options.revalidate,
  })
}

// Every ETF across all pages (the API caps limit at 100). For server-side
// enumeration: generateStaticParams and the sitemap.
export async function getAllEtfs(options: ServerOptions = {}): Promise<Etf[]> {
  const PAGE_SIZE = 100
  const first = await getEtfs({ limit: PAGE_SIZE, page: 1 }, options)
  const all = [...first.data]
  for (let page = 2; page <= first.meta.totalPages; page++) {
    const next = await getEtfs({ limit: PAGE_SIZE, page }, options)
    all.push(...next.data)
  }
  return all
}

// Available filter values + counts for the screener toolbar (faceted search).
export function getEtfFilters(): Promise<EtfFilters> {
  return get<EtfFilters>('/etfs/filters', { label: 'getEtfFilters' })
}
