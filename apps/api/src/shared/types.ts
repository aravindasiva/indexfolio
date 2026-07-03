import type { PrismaClient } from '@indexfolio/db'
import type { Redis } from 'ioredis'

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient
    redis: Redis
  }
}
