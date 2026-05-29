import { z } from 'zod'

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
})

export const ReadyResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  db: z.enum(['connected', 'disconnected']),
  redis: z.enum(['connected', 'disconnected']),
})

export type HealthResponse = z.infer<typeof HealthResponseSchema>
export type ReadyResponse = z.infer<typeof ReadyResponseSchema>
