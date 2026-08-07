import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  clean: true,
  sourcemap: true,
  // @sentry/node stays external; the SDK relies on OpenTelemetry and misbehaves when bundled.
  external: ['@prisma/client', '@sentry/node'],
})
