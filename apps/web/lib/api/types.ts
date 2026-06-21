/*
  API response/param types, as the API serialises them over JSON (fundSizeEur
  and dates are strings - not the bigint/Date domain shape). Kept separate from
  the request logic so api.ts stays small as endpoints grow.
*/
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
  isAccumulating?: boolean
  domicile?: string
  exchange?: string
  assetClass?: string
  maxTer?: number
  minFundSize?: string
  sort?: 'ter' | 'fundSizeEur' | 'inceptionDate' | 'ticker' | 'name'
  order?: 'asc' | 'desc'
}
