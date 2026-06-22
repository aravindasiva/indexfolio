import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getEtfByTicker, getEtfList } from '../../../lib/api'

type FetchResult = {
  ok?: boolean
  status?: number
  json?: () => Promise<unknown>
}

function stubFetch(result: FetchResult = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
    ...result,
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  // Silence the dev request logging during tests.
  vi.spyOn(console, 'info').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('getEtfList', () => {
  it('builds the /etfs URL with the given params', async () => {
    const fetchMock = stubFetch({ json: async () => ({ data: [], meta: {} }) })

    await getEtfList({ page: 2, domicile: 'IE', maxTer: 0.5 })

    const url = String(fetchMock.mock.calls[0]?.[0])
    expect(url).toContain('http://test.local/etfs?')
    expect(url).toContain('page=2')
    expect(url).toContain('domicile=IE')
    expect(url).toContain('maxTer=0.5')
  })

  it('omits absent filters from the query string', async () => {
    const fetchMock = stubFetch({ json: async () => ({ data: [], meta: {} }) })

    await getEtfList({ page: 1 })

    const url = String(fetchMock.mock.calls[0]?.[0])
    expect(url).not.toContain('domicile')
    expect(url).not.toContain('maxTer')
  })

  it('returns the parsed JSON on success', async () => {
    const payload = { data: [{ ticker: 'VWCE' }], meta: { total: 1 } }
    stubFetch({ json: async () => payload })

    await expect(getEtfList()).resolves.toEqual(payload)
  })

  it('throws an ApiError carrying the status on a non-2xx response', async () => {
    stubFetch({ ok: false, status: 500 })

    await expect(getEtfList()).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
    })
  })

  it('throws an ApiError when fetch itself rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(getEtfList()).rejects.toMatchObject({
      name: 'ApiError',
      status: 0,
    })
  })
})

describe('getEtfByTicker', () => {
  it('builds the /etfs/:ticker URL', async () => {
    const fetchMock = stubFetch({ json: async () => ({ ticker: 'VWCE' }) })

    await getEtfByTicker('VWCE')

    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      'http://test.local/etfs/VWCE',
    )
  })
})
