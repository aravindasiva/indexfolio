// Source: Lei n.o 24-D/2022, amended by Lei n.o 31/2024
// Official reference: https://info.portaldasfinancas.gov.pt/

export interface HoldingDiscount {
  minYears: number
  maxYears: number
  rate: number
}

export interface PortugalTaxConfig {
  readonly flatRate: number
  readonly holdingDiscounts: readonly HoldingDiscount[]
  readonly method: 'FIFO'
  readonly annualForm: string
  readonly annexCapitalGains: string
  readonly annexForeignIncome: string
}

export const PORTUGAL_TAX: PortugalTaxConfig = {
  flatRate: 0.28,
  holdingDiscounts: [
    { minYears: 0, maxYears: 2, rate: 0.28 },
    { minYears: 2, maxYears: 5, rate: 0.265 },
    { minYears: 5, maxYears: 8, rate: 0.24 },
    { minYears: 8, maxYears: Infinity, rate: 0.196 },
  ],
  method: 'FIFO',
  annualForm: 'Modelo 3',
  annexCapitalGains: 'Anexo G',
  annexForeignIncome: 'Anexo J',
} as const
