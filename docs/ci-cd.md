# CI/CD

GitHub Actions owns every deploy. The Vercel and Railway git integrations are
disconnected on purpose, so there is exactly one path to production and nothing
deploys behind our back.

## Workflows

| Workflow             | Trigger                 | Does                                                                   |
| -------------------- | ----------------------- | ---------------------------------------------------------------------- |
| `gatekeeper.yml`     | PR to `dev` or `main`   | Runs checks; deploys a Vercel preview for web-affecting PRs into `dev` |
| `bossman.yml`        | push to `dev` or `main` | Runs checks, then deploys API, reseeds staging, deploys web            |
| `checks.yml`         | called by the above     | Format, lint, typecheck, test, build, SonarQube                        |
| `deploy-api.yml`     | called by Bossman       | `railway up` the API                                                   |
| `deploy-web.yml`     | called by Bossman       | `vercel build` + `vercel deploy`                                       |
| `reseed-staging.yml` | called by Bossman       | Reset + reseed the staging DB                                          |

Path filters (dorny/paths-filter) decide what actually runs: API changes deploy
the API, `apps/web/**` or `packages/**` deploy web, seed-data changes reseed.

## Environments

| Branch | Web                                                    | API                        |
| ------ | ------------------------------------------------------ | -------------------------- |
| `dev`  | staging (login-gated via Vercel Deployment Protection) | staging.api.indexfolio.dev |
| `main` | www.indexfolio.dev                                     | api.indexfolio.dev         |

Flow: branch -> PR to `dev` (preview + checks) -> merge (deploys staging) ->
verify -> PR `dev` to `main` -> merge (deploys production).

## API deploy (Railway)

Built from `apps/api/Dockerfile` (multi-stage, Debian slim) driven by
`railway.toml` (config-as-code, overrides the dashboard). On start it runs
`prisma migrate deploy` then the server. Railway healthchecks `/health`.

Required: secrets `RAILWAY_TOKEN_STAGING` / `RAILWAY_TOKEN_PRODUCTION`, vars
`RAILWAY_API_STAGING_SERVICE_ID` / `RAILWAY_API_PRODUCTION_SERVICE_ID`. On each
Railway service: `DATABASE_URL`, `REDIS_URL`, `PORT`, `ENVIRONMENT`,
`API_BASE_URL`.

## Web deploy (Vercel)

`vercel pull` + `vercel build` + `vercel deploy --prebuilt`. Required secrets:
`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

## Rollback

- API: revert the offending commit/PR. If `railway.toml` is reverted away,
  Railway falls back to the previous build. No DB state to undo (migrations are
  forward-only; don't ship a migration you can't roll forward past).
- Web: redeploy the previous commit, or promote the last good Vercel deployment.

## Gotchas (learned the hard way)

- **Docker startCommand needs a shell.** With `builder = "DOCKERFILE"`, Railway
  runs `startCommand` as the ENTRYPOINT with no shell, so `&&` does not chain.
  Wrap it: `startCommand = "/bin/sh -c '... && ...'"`. (Nixpacks ran it in a
  shell, which is why the pre-Docker deploy worked.)
- **Use Debian, not Alpine.** The image is `node:24-slim`. Alpine/musl adds a
  tail of DNS/TLS/Prisma issues for little size benefit.
- **Vercel uploads:** deploy with `--archive=tgz` (one tarball) to avoid the
  intermittent per-file "Upload aborted". All deploy steps retry with backoff.
- **Node version** comes from `.nvmrc` (single source for CI and Railway).
- **Previews** run only for web PRs into `dev` from this repo (not forks, not
  `dev`->`main`, not API-only PRs).
