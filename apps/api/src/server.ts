import Fastify from 'fastify'
import { env } from './shared/config/env.js'

const server = Fastify({ logger: true })

// Plugin registration order: db, redis, swagger, auth
// Module route registration: etf, holdings, prices, system

async function start(): Promise<void> {
  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
