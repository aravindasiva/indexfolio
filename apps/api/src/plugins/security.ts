import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { env } from '../shared/config/env.js'

const VERCEL_PREVIEW = /^https:\/\/indexfolio[-a-z0-9]*\.vercel\.app$/

function isAllowedOrigin(origin: string): boolean {
  if (origin === 'http://localhost:3000') return true
  if (origin === 'https://indexfolio.dev') return true
  if (VERCEL_PREVIEW.test(origin)) return true
  if (env.CORS_ORIGIN) {
    return env.CORS_ORIGIN.split(',')
      .map((o) => o.trim())
      .includes(origin)
  }
  return false
}

async function securityPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(cors, {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (isAllowedOrigin(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'), false)
    },
    credentials: true,
  })

  await fastify.register(helmet, { contentSecurityPolicy: false })

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })
}

export default fp(securityPlugin, { name: 'security' })
