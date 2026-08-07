import crypto from 'node:crypto'

// Sentry's free tier has no native Discord, so its alerts POST to a route handler that
// calls this. This is the actual logic; the route in app/ is just the endpoint.

const DISCORD_WEBHOOK = process.env.DISCORD_PLATFORM_DIGEST_WEBHOOK
const SENTRY_SECRET = process.env.SENTRY_WEBHOOK_SECRET

const LEVEL_COLOR: Record<string, number> = {
  fatal: 0xe0483d,
  error: 0xe0483d,
  warning: 0xfbbf24,
  info: 0x635bff,
  debug: 0x8a8aa2,
}

interface SentrySource {
  title?: string
  culprit?: string
  level?: string
  project?: string
  web_url?: string
  issue_url?: string
  url?: string
}

interface SentryWebhook {
  data?: { event?: SentrySource; issue?: SentrySource }
}

function verify(raw: string, signature: string | null): boolean {
  if (!SENTRY_SECRET || !signature) return false
  const digest = crypto
    .createHmac('sha256', SENTRY_SECRET)
    .update(raw, 'utf8')
    .digest('hex')
  const expected = Buffer.from(digest)
  const actual = Buffer.from(signature)
  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  )
}

function toEmbed(source: SentrySource) {
  const level = (source.level ?? 'error').toLowerCase()
  return {
    title: (source.title ?? 'New issue').slice(0, 250),
    url: source.web_url ?? source.issue_url ?? source.url,
    color: LEVEL_COLOR[level] ?? LEVEL_COLOR.error,
    description: source.culprit
      ? String(source.culprit).slice(0, 300)
      : undefined,
    footer: {
      text: `Sentry${source.project ? ` · ${source.project}` : ''} · ${level}`,
    },
  }
}

export async function relaySentryWebhook(request: Request): Promise<Response> {
  const raw = await request.text()

  // Fail closed: a missing secret or bad signature is rejected.
  if (!verify(raw, request.headers.get('sentry-hook-signature'))) {
    return new Response('invalid signature', { status: 401 })
  }
  // Acknowledge (so Sentry does not retry) even with nowhere to forward.
  if (!DISCORD_WEBHOOK) return new Response('ok', { status: 200 })

  const payload = JSON.parse(raw) as SentryWebhook
  const source = payload.data?.event ?? payload.data?.issue
  if (!source) return new Response('ok', { status: 200 })

  await fetch(DISCORD_WEBHOOK, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ embeds: [toEmbed(source)] }),
  }).catch(() => undefined)

  return new Response('ok', { status: 200 })
}
