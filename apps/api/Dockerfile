# syntax=docker/dockerfile:1

# ─── Stage 1: deps ────────────────────────────────────────────────────────────
# Install all workspace dependencies so pnpm workspace resolution works.
# Only package.json manifests are copied here; source is excluded for layer caching.
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /repo

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json                          ./apps/api/
COPY apps/web/package.json                          ./apps/web/
COPY packages/etf-types/package.json                ./packages/etf-types/
COPY packages/knowledge-graph/package.json          ./packages/knowledge-graph/
COPY packages/tax-engine/package.json               ./packages/tax-engine/
COPY workers/pipelines/etf-scraper/package.json     ./workers/pipelines/etf-scraper/
COPY workers/pipelines/holdings-fetcher/package.json ./workers/pipelines/holdings-fetcher/
COPY workers/pipelines/price-updater/package.json   ./workers/pipelines/price-updater/

RUN pnpm install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build ───────────────────────────────────────────────────────────
FROM deps AS build
WORKDIR /repo

COPY tsconfig.base.json ./
COPY apps/api/ ./apps/api/

# Compile TypeScript → dist/server.js (pnpm script handles prisma generate too)
RUN pnpm --filter @indexfolio/api exec prisma generate
RUN pnpm --filter @indexfolio/api build

# Create a standalone production bundle using pnpm deploy.
# This produces a flat node_modules (no pnpm virtual store) with only prod deps.
RUN pnpm --filter @indexfolio/api deploy --prod /standalone

# Copy compiled output and Prisma schema/migrations into the bundle.
RUN cp -r apps/api/dist /standalone/dist \
 && cp -r apps/api/prisma /standalone/prisma

# Re-generate the Prisma client inside the standalone flat node_modules so the
# engine binary paths resolve correctly at runtime.
WORKDIR /standalone
RUN node_modules/.bin/prisma generate --schema=prisma/schema.prisma

# ─── Stage 3: runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 fastify

WORKDIR /app

COPY --from=build /standalone .
RUN chmod -R a-w .

USER fastify

ENV NODE_ENV=production

EXPOSE 3001

# Run pending migrations then start the server.
# `prisma` is in dependencies, so the CLI is available in node_modules/.bin.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/server.js"]
