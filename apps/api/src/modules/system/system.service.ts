import type { PrismaClient } from '@prisma/client'
import type { Redis } from 'ioredis'
import type { HealthResponse, ReadyResponse } from './system.schema.js'

export function getHealth(): HealthResponse {
  return { status: 'ok' }
}

export async function getReady(
  db: PrismaClient,
  redis: Redis,
): Promise<ReadyResponse> {
  let dbStatus: 'connected' | 'disconnected' = 'disconnected'
  let redisStatus: 'connected' | 'disconnected' = 'disconnected'

  try {
    await db.$queryRaw`SELECT 1`
    dbStatus = 'connected'
  } catch {
    // db unreachable
  }

  try {
    await redis.ping()
    redisStatus = 'connected'
  } catch {
    // redis unreachable
  }

  const status =
    dbStatus === 'connected' && redisStatus === 'connected' ? 'ok' : 'degraded'

  return { status, db: dbStatus, redis: redisStatus }
}
