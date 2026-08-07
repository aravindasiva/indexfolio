import { relaySentryWebhook } from '@/lib/sentry/relay'

// Next.js route handler: this file defines the /api/sentry-webhook endpoint.
// The logic lives in lib/sentry/relay.ts; this is just the wiring.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function POST(request: Request): Promise<Response> {
  return relaySentryWebhook(request)
}
