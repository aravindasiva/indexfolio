import * as Sentry from '@sentry/nextjs'

// Guarded smoke test: reports a test error to Sentry so you can confirm the pipeline.
// 404 unless the correct SENTRY_DEBUG_TOKEN is passed, so it is safe in production.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token')
  if (
    !process.env.SENTRY_DEBUG_TOKEN ||
    token !== process.env.SENTRY_DEBUG_TOKEN
  ) {
    return new Response('not found', { status: 404 })
  }
  Sentry.captureException(new Error('Sentry smoke test (web)'))
  await Sentry.flush(2000)
  return new Response('Sentry test error sent', { status: 200 })
}
