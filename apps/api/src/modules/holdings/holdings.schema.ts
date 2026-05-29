import { z } from 'zod'

export const HoldingsQuerySchema = z.object({
  etfId: z.string().min(1),
  asOfDate: z.string().datetime().optional(),
})

export type HoldingsQuery = z.infer<typeof HoldingsQuerySchema>
