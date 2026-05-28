import { describe, expect, it } from 'vitest'
import { HealthResponseSchema, ReadyResponseSchema } from './system.schema.js'

describe('HealthResponseSchema', () => {
  it('parses a valid health response', () => {
    expect(HealthResponseSchema.parse({ status: 'ok' })).toEqual({ status: 'ok' })
  })

  it('rejects an invalid status', () => {
    expect(() => HealthResponseSchema.parse({ status: 'error' })).toThrow()
  })
})

describe('ReadyResponseSchema', () => {
  it('parses a fully connected ready response', () => {
    const result = ReadyResponseSchema.parse({
      status: 'ok',
      db: 'connected',
      redis: 'connected',
    })
    expect(result.status).toBe('ok')
  })

  it('parses a degraded ready response', () => {
    const result = ReadyResponseSchema.parse({
      status: 'degraded',
      db: 'disconnected',
      redis: 'connected',
    })
    expect(result.status).toBe('degraded')
  })
})
