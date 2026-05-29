import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function dbPlugin(_fastify: FastifyInstance): Promise<void> {
  // Phase 1 stub - Prisma client registration wired in Phase 2
}

export default fp(dbPlugin, { name: 'db' })
