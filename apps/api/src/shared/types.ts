import type { PrismaClient } from '@prisma/client'
import type { Redis } from 'ioredis'

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient
    redis: Redis
  }
}
