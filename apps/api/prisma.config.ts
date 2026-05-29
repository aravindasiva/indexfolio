import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // process.env direct access (not env() helper) so prisma generate
    // does not throw when DATABASE_URL is absent in CI type-check runs
    url: process.env['DATABASE_URL'] ?? '',
  },
})
