import { z } from 'zod'

export const EtfParamsSchema = z.object({
  ticker: z.string().min(1).max(20),
})

export const EtfListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

export type EtfParams = z.infer<typeof EtfParamsSchema>
export type EtfListQuery = z.infer<typeof EtfListQuerySchema>
