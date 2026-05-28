import { z } from 'zod'

export const PricesQuerySchema = z.object({
  etfId: z.string().min(1),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

export type PricesQuery = z.infer<typeof PricesQuerySchema>
