import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function redisPlugin(_fastify: FastifyInstance): Promise<void> {
  // Phase 1 stub - ioredis client registration wired in Phase 2
}

export default fp(redisPlugin, { name: 'redis' })
