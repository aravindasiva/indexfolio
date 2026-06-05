import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  EtfListQuerySchema,
  EtfListResponseSchema,
  EtfParamsSchema,
  EtfResponseSchema,
} from './etf.schema.js'
import { getEtfByTicker, listEtfs } from './etf.service.js'

export async function etfRoutes(fastify: FastifyInstance): Promise<void> {
  const f = fastify.withTypeProvider<ZodTypeProvider>()

  f.get(
    '/etfs',
    {
      schema: {
        querystring: EtfListQuerySchema,
        response: { 200: EtfListResponseSchema },
        tags: ['etf'],
        summary: 'List ETFs with filters and pagination',
      },
    },
    async (request) => listEtfs(request.query, fastify.db),
  )

  f.get(
    '/etfs/:ticker',
    {
      schema: {
        params: EtfParamsSchema,
        response: { 200: EtfResponseSchema },
        tags: ['etf'],
        summary: 'Get ETF by ticker',
      },
    },
    async (request) => getEtfByTicker(request.params.ticker, fastify.db),
  )
}
