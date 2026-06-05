import Fastify, { type FastifyError } from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './shared/config/env.js'
import { AppError, ErrorCode } from './shared/error.js'
import dbPlugin from './plugins/db.js'
import redisPlugin from './plugins/redis.js'
import securityPlugin from './plugins/security.js'
import swaggerPlugin from './plugins/swagger.js'
import { systemRoutes } from './modules/system/system.routes.js'
import { etfRoutes } from './modules/etf/etf.routes.js'

const server = Fastify({
  logger:
    env.NODE_ENV === 'production'
      ? true
      : { transport: { target: 'pino-pretty', options: { colorize: true } } },
})

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.withTypeProvider<ZodTypeProvider>()

server.setErrorHandler<FastifyError>((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: { code: error.code, message: error.message },
    })
  }

  if (error.statusCode === 400) {
    return reply.status(400).send({
      error: { code: ErrorCode.VALIDATION_ERROR, message: error.message },
    })
  }

  server.log.error(error)
  return reply.status(500).send({
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message:
        env.NODE_ENV === 'development'
          ? error.message
          : 'An unexpected error occurred',
    },
  })
})

async function start(): Promise<void> {
  await server.register(securityPlugin)
  await server.register(dbPlugin)
  await server.register(redisPlugin)
  await server.register(swaggerPlugin)

  await server.register(systemRoutes)
  await server.register(etfRoutes)

  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' })

    if (env.NODE_ENV !== 'production') {
      console.log(`
  🚀  Indexfolio API

  ➜  Local:    http://localhost:${env.PORT}
  ➜  Docs:     http://localhost:${env.PORT}/docs
  ➜  Health:   http://localhost:${env.PORT}/health
  ➜  Env:      ${env.NODE_ENV}
`)
    }
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
