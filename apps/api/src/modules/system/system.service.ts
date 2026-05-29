import type { HealthResponse, ReadyResponse } from './system.schema.js'

export function getHealth(): HealthResponse {
  return { status: 'ok' }
}

export function getReady(): ReadyResponse {
  return { status: 'ok', db: 'connected', redis: 'connected' }
}
