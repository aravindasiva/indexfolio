import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import Redis from 'ioredis'
import { env } from '../shared/config/env.js'

async function redisPlugin(fastify: FastifyInstance): Promise<void> {
  const redis = new Redis(env.REDIS_URL, { lazyConnect: true })
  await redis.connect()
  fastify.decorate('redis', redis)
  fastify.addHook('onClose', async () => {
    await redis.quit()
  })
}

export default fp(redisPlugin, { name: 'redis' })
