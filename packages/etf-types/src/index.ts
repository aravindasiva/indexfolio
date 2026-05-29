export interface ETF {
  id: string
  ticker: string
  isin: string
  name: string
  domicile: string
  exchange: string
  currency: string
  ter: number
  fundSizeEur: bigint
  isAccumulating: boolean
  isUcits: boolean
  indexTracked: string
  assetClass: string
  provider: string
  inceptionDate: Date
  kiidUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Holding {
  id: string
  etfId: string
  ticker: string
  name: string
  weight: number
  country: string
  sector: string
  asOfDate: Date
}

export interface Price {
  id: string
  etfId: string
  date: Date
  close: number
  currency: string
}

export interface ScreenerFilters {
  isAccumulating?: boolean
  domicile?: string
  exchange?: string
  terMin?: number
  terMax?: number
  fundSizeMin?: number
  assetClass?: string
  indexTracked?: string
}
