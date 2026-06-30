// API types as serialised over JSON: fundSizeEur and dates are strings, not the
// bigint/Date domain shape.
export type Etf = {
  id: string
  ticker: string
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

export type EtfListResponse = {
  data: Etf[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export type EtfListParams = {
  page?: number
  limit?: number
  search?: string
  isAccumulating?: boolean
  domicile?: string
  exchange?: string
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
  assetClass: FilterOption[]
}
