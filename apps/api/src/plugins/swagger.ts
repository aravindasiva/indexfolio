import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

const ENV_LABELS: Record<string, string> = {
  production: 'Production',
  staging: 'Staging',
}

function serverDescription(): string {
  return ENV_LABELS[process.env['ENVIRONMENT'] ?? ''] ?? 'Local development'
}

async function swaggerPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Indexfolio API',
        description: 'Free toolkit for EU passive investors',
        version: '1.0.0',
      },
      servers: [
        {
          url:
            process.env['API_BASE_URL'] ??
            `http://localhost:${process.env['PORT'] ?? 3001}`,
          description: serverDescription(),
        },
      ],
    },
    transform: jsonSchemaTransform,
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  })
}

export default fp(swaggerPlugin, { name: 'swagger' })
