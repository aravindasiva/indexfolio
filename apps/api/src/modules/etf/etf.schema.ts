import { z } from 'zod'

export const EtfParamsSchema = z.object({
  ticker: z.string().min(1).max(20),
})

export const EtfListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  isAccumulating: z.enum(['true', 'false']).optional(),
  domicile: z.string().optional(),
  exchange: z.string().optional(),
  currency: z.string().optional(),
  assetClass: z.string().optional(),
  maxTer: z.coerce.number().positive().optional(),
  minFundSize: z.coerce.bigint().optional(),
  sort: z.enum(['ter', 'fundSizeEur', 'inceptionDate', 'name']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
})

// One venue the fund trades on. `ticker` is the local ticker there (e.g. EUNL on Xetra).
export const ListingSchema = z.object({
  ticker: z.string(),
  exchange: z.string(),
  currency: z.string(),
  isPrimary: z.boolean(),
})

// Fund-level facts, identical across venues. `ticker`/`exchange`/`currency` are the primary
// listing's; `matchedTicker` is the listing the request resolved to (the searched or routed ticker).
export const EtfResponseSchema = z.object({
  id: z.string(),
  ticker: z.string(),
  matchedTicker: z.string(),
  name: z.string(),
  isin: z.string(),
  domicile: z.string(),
  exchange: z.string(),
  currency: z.string(),
  ter: z.number().nullable(),
  fundSizeEur: z.string().nullable(),
  isAccumulating: z.boolean(),
  isUcits: z.boolean(),
  indexTracked: z.string().nullable(),
  assetClass: z.string().nullable(),
  provider: z.string(),
  inceptionDate: z.string().nullable(),
})

// Screener row: the fund plus the signals that hint at its other venues.
export const EtfListItemSchema = EtfResponseSchema.extend({
  currencies: z.array(z.string()),
  exchangeCount: z.number().int(),
})

// Detail: the fund plus every venue it trades on.
export const EtfDetailSchema = EtfResponseSchema.extend({
  listings: z.array(ListingSchema),
})

export const EtfListResponseSchema = z.object({
  data: z.array(EtfListItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
})

// Facets: available filter values with counts.
const FilterOptionSchema = z.object({
  value: z.string(),
  count: z.number().int(),
})

export const EtfFiltersResponseSchema = z.object({
  domicile: z.array(FilterOptionSchema),
  exchange: z.array(FilterOptionSchema),
  currency: z.array(FilterOptionSchema),
  assetClass: z.array(FilterOptionSchema),
})

export type EtfParams = z.infer<typeof EtfParamsSchema>
export type EtfListQuery = z.infer<typeof EtfListQuerySchema>
export type EtfResponse = z.infer<typeof EtfResponseSchema>
export type EtfListItem = z.infer<typeof EtfListItemSchema>
export type EtfDetail = z.infer<typeof EtfDetailSchema>
export type EtfListResponse = z.infer<typeof EtfListResponseSchema>
export type EtfFiltersResponse = z.infer<typeof EtfFiltersResponseSchema>
