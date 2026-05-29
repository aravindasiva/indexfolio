import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function authPlugin(_fastify: FastifyInstance): Promise<void> {
  // Phase 1 stub - authentication hooks wired in Phase 2
}

export default fp(authPlugin, { name: 'auth' })
