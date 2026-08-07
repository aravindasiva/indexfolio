# Platform observability

How the public platform (web + API) is monitored. This is separate from the private
engine, which has its own monitoring (`#engine-*` on Discord + Healthchecks.io) and is
never instrumented with anything here.

## The layers

| Layer               | Tool                           | Answers             | Routes to          |
| ------------------- | ------------------------------ | ------------------- | ------------------ |
| Uptime (outside-in) | Upptime                        | "Is it reachable?"  | `#platform-alerts` |
| Errors (inside-out) | Sentry                         | "Why did it break?" | `#platform-digest` |
| Deploys             | GitHub Actions (`bossman.yml`) | "What shipped?"     | `#platform-digest` |

- **Upptime** lives in the separate public repo `aravindasiva/indexfolio-status`. It pings
  `https://www.indexfolio.dev` and `https://api.indexfolio.dev/health` every ~5 min and
  posts DOWN/UP to `#platform-alerts`. Status page: https://aravindasiva.github.io/indexfolio-status
- **Sentry** captures unexpected exceptions from the web and API into two projects
  (`indexfolio-web`, `indexfolio-api`) with readable stack traces. Free Developer plan.
- **Deploys** post a summary to `#platform-digest` on every production deploy.

## Sentry: how it is wired

- **Web** (`apps/web`): `@sentry/nextjs`. Init options are shared from `apps/web/lib/sentry/options.ts`;
  `instrumentation.ts` inits the server + edge runtimes and exports `onRequestError`, and
  `instrumentation-client.ts` inits the browser. Both of those must sit at the app root - Next.js
  requires it. `next.config.ts` is wrapped with `withSentryConfig` (source-map upload, ad-blocker
  tunnel at `/monitoring`). Source maps upload during `next build` in CI when `SENTRY_AUTH_TOKEN`
  is set.
- **API** (`apps/api`): `@sentry/node`. `src/shared/sentry.ts` exports `initSentry()`, which
  `server.ts` calls once at startup; `server.ts` also adds `setupFastifyErrorHandler` and a
  `captureException` in the 500 branch. Readable traces come from Node's `--enable-source-maps`
  (in the start command) reading tsup's emitted maps at runtime, so the API needs **no** Sentry
  source-map upload and no auth token. `@sentry/node` is external in `tsup.config.ts` since the
  SDK misbehaves when bundled.
- **Relay**: Sentry free has no native Discord, so its alert rules POST to the
  `/api/sentry-webhook` route handler (`apps/web/app/api/sentry-webhook/route.ts`, a thin
  endpoint). The logic in `apps/web/lib/sentry/relay.ts` verifies the HMAC signature and
  forwards a Discord embed to `#platform-digest`. No extra platform to run.

Errors-first everywhere: `tracesSampleRate: 0`, Session Replay off, `sendDefaultPii: false`,
plus a `beforeSend` that strips cookies/auth headers. This protects the free 5k-errors/mo
quota and keeps PII out. If a DSN is unset, Sentry is a no-op, so local dev is unaffected.

## Environment variables (where each lives)

| Variable                               | Where                          | Purpose                                           |
| -------------------------------------- | ------------------------------ | ------------------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN`               | Vercel (prod + preview), local | Web DSN (browser + server)                        |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT`       | Vercel per env                 | `production` / `preview` tag                      |
| `SENTRY_WEBHOOK_SECRET`                | Vercel                         | Verifies Sentry's webhook signature at the relay  |
| `DISCORD_PLATFORM_DIGEST_WEBHOOK`      | Vercel + GitHub secret         | `#platform-digest` webhook (relay + deploy notes) |
| `SENTRY_AUTH_TOKEN`                    | GitHub secret                  | Web source-map upload in CI                       |
| `SENTRY_ORG`, `SENTRY_PROJECT`         | GitHub repo variables          | Web source-map upload target                      |
| `SENTRY_DSN`                           | Railway (api), local           | API DSN                                           |
| `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` | Railway (api)                  | Env tag + git SHA release                         |

## First-time setup

1. Create a Sentry account (free Developer), an org, and two projects: `indexfolio-web`
   (Next.js) and `indexfolio-api` (Node). Copy both DSNs.
2. Create a Sentry **auth token** with source-map upload scope (project releases + read).
3. Create a Sentry **Internal Integration** to get a webhook signing secret. Add per-project
   **alert rules**: "a new issue is created" and "an issue regresses" -> Webhook action ->
   `https://www.indexfolio.dev/api/sentry-webhook`. New/regressed only, to keep the digest quiet.
4. Add the variables above to Vercel, Railway, and GitHub. Ensure the `#platform-digest`
   webhook exists.
5. Verify: trigger a test error in each app, confirm it lands in the right Sentry project with
   a readable stack trace, and that the alert reaches `#platform-digest` (test against
   `#sbx-platform-digest` first by pointing the webhook there).

## Escape hatch (no lock-in)

The apps use the MIT `@sentry/*` SDKs against the open Sentry ingest protocol. To move off
hosted Sentry, stand up self-hosted **GlitchTip** (MIT, Sentry-compatible) and change only the
DSN env vars - no application code changes.
