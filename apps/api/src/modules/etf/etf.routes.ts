import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  EtfDetailSchema,
  EtfFiltersResponseSchema,
  EtfListQuerySchema,
  EtfListResponseSchema,
  EtfParamsSchema,
} from './etf.schema.js'
import { getEtfByTicker, getEtfFilters, getEtfs } from './etf.service.js'

export async function etfRoutes(fastify: FastifyInstance): Promise<void> {
  const f = fastify.withTypeProvider<ZodTypeProvider>()

  f.get(
    '/etfs',
    {
      schema: {
        querystring: EtfListQuerySchema,
        response: { 200: EtfListResponseSchema },
        tags: ['etf'],
        summary: 'List ETFs with search, filters and pagination',
      },
    },
    async (request) => getEtfs(request.query, fastify.db),
  )

  // Register before '/etfs/:ticker' so 'filters' is not captured as a ticker param.
  f.get(
    '/etfs/filters',
    {
      schema: {
        response: { 200: EtfFiltersResponseSchema },
        tags: ['etf'],
        summary: 'Available filter options with counts',
      },
    },
    async () => getEtfFilters(fastify.db),
  )

  f.get(
    '/etfs/:ticker',
    {
      schema: {
        params: EtfParamsSchema,
        response: { 200: EtfDetailSchema },
        tags: ['etf'],
        summary: 'Get ETF by ticker',
      },
    },
    async (request) => getEtfByTicker(request.params.ticker, fastify.db),
  )
}
