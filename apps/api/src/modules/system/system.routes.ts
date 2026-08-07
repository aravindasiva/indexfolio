import type { FastifyInstance } from 'fastify'
import { HealthResponseSchema, ReadyResponseSchema } from './system.schema.js'
import { getHealth, getReady } from './system.service.js'

export async function systemRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/health',
    {
      schema: {
        response: { 200: HealthResponseSchema },
        tags: ['system'],
        summary: 'Liveness check',
      },
    },
    async () => getHealth(),
  )

  fastify.get(
    '/ready',
    {
      schema: {
        response: {
          200: ReadyResponseSchema,
          503: ReadyResponseSchema,
        },
        tags: ['system'],
        summary: 'Readiness check',
      },
    },
    async (_request, reply) => {
      const result = await getReady(fastify.db, fastify.redis)
      if (result.status === 'degraded') {
        return reply.code(503).send(result)
      }
      return result
    },
  )

  // Guarded smoke test: throws on demand so you can confirm errors reach Sentry.
  // 404 unless the correct SENTRY_DEBUG_TOKEN is passed, so it is safe in production.
  fastify.get('/debug-sentry', async (request, reply) => {
    const token = (request.query as { token?: string }).token
    if (
      !process.env.SENTRY_DEBUG_TOKEN ||
      token !== process.env.SENTRY_DEBUG_TOKEN
    ) {
      return reply.callNotFound()
    }
    throw new Error('Sentry smoke test (API)')
  })
}
