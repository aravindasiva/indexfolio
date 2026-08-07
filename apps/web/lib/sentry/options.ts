import type { ErrorEvent } from '@sentry/nextjs'

// Belt and braces on top of sendDefaultPii:false: never ship cookies or auth headers.
function scrub(event: ErrorEvent): ErrorEvent {
  if (event.request) {
    delete event.request.cookies
    const headers = event.request.headers
    if (headers) {
      delete headers.cookie
      delete headers.authorization
    }
  }
  return event
}

// Shared by instrumentation.ts (server/edge) and instrumentation-client.ts (browser).
export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? 'development',
  tracesSampleRate: 0,
  sendDefaultPii: false,
  beforeSend: scrub,
}
