import * as Sentry from '@sentry/node'
import type { ErrorEvent } from '@sentry/node'

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

// No DSN means this is a no-op, so local dev and tests run untouched.
export function initSentry(): void {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrub,
  })
}
