// API types as serialised over JSON: fundSizeEur and dates are strings, not the
// bigint/Date domain shape.
export type Etf = {
  id: string
  ticker: string
  matchedTicker: string
  name: string
  isin: string
  domicile: string
  exchange: string
  currency: string
  ter: number
  fundSizeEur: string
  isAccumulating: boolean
  isUcits: boolean
  indexTracked: string
  assetClass: string
  provider: string
  inceptionDate: string
}

// One venue a fund trades on: the exchange, its local ticker there, and the currency.
export type Listing = {
  ticker: string
  exchange: string
  currency: string
  isPrimary: boolean
}

// A fund plus every venue it trades on (the detail endpoint).
export type EtfDetail = Etf & { listings: Listing[] }

// A screener row: the fund plus the signals that hint at its other venues.
export type EtfListItem = Etf & {
  currencies: string[]
  exchangeCount: number
}

export type EtfListResponse = {
  data: EtfListItem[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export type EtfListParams = {
  page?: number
  limit?: number
  search?: string
  isAccumulating?: boolean
  domicile?: string
  exchange?: string
  currency?: string
  assetClass?: string
  maxTer?: number
  minFundSize?: string
  sort?: 'ter' | 'fundSizeEur' | 'inceptionDate' | 'ticker' | 'name'
  order?: 'asc' | 'desc'
}

// Available filter values with counts (from GET /etfs/filters).
export type FilterOption = { value: string; count: number }
export type EtfFilters = {
  domicile: FilterOption[]
  exchange: FilterOption[]
  currency: FilterOption[]
  assetClass: FilterOption[]
}
