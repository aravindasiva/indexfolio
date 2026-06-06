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
}
