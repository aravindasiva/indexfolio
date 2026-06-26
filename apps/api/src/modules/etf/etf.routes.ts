import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  EtfFiltersResponseSchema,
  EtfListQuerySchema,
  EtfListResponseSchema,
  EtfParamsSchema,
  EtfResponseSchema,
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

  // Static route registered before '/etfs/:ticker' so it is not captured as a
  // ticker param. Returns the available filter values with counts.
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
        response: { 200: EtfResponseSchema },
        tags: ['etf'],
        summary: 'Get ETF by ticker',
      },
    },
    async (request) => getEtfByTicker(request.params.ticker, fastify.db),
  )
}
