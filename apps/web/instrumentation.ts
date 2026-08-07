import * as Sentry from '@sentry/nextjs'
import { sentryOptions } from './lib/sentry/options'

// Server + edge init here; the browser inits in instrumentation-client.ts.
export function register(): void {
  const runtime = process.env.NEXT_RUNTIME
  if (runtime === 'nodejs' || runtime === 'edge') {
    Sentry.init(sentryOptions)
  }
}

export const onRequestError = Sentry.captureRequestError
