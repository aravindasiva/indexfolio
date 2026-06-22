import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Tests live in tests/ mirroring the source tree (same as apps/api), so they
    // are never part of the build - only run here as a quality gate. Tests use
    // relative imports into the source (not the @/ alias), matching apps/api.
    include: ['tests/**/*.test.ts'],
    // Base URL for the api client under test (never hits the network - fetch is mocked).
    env: { NEXT_PUBLIC_API_URL: 'http://test.local' },
  },
})
