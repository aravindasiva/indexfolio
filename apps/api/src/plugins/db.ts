import { PrismaClient } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function dbPlugin(fastify: FastifyInstance): Promise<void> {
  const prisma = new PrismaClient()
  await prisma.$connect()
  fastify.decorate('db', prisma)
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
}

export default fp(dbPlugin, { name: 'db' })
