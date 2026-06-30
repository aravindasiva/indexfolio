# syntax=docker/dockerfile:1

# Stage 1: deps. Copy only manifests (not source) so the install layer caches.
FROM node:24-slim AS deps
# openssl is needed by the Prisma engine on Debian.
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*
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

# Stage 2: build.
FROM deps AS build
WORKDIR /repo

COPY tsconfig.base.json ./
COPY apps/api/ ./apps/api/

RUN pnpm --filter @indexfolio/api exec prisma generate
RUN pnpm --filter @indexfolio/api build

# pnpm deploy gives a flat node_modules (no virtual store) with prod deps only.
RUN pnpm --filter @indexfolio/api deploy --prod /standalone

RUN cp -r apps/api/dist /standalone/dist \
 && cp -r apps/api/prisma /standalone/prisma

# Re-generate inside the flat node_modules so engine binary paths resolve at runtime.
WORKDIR /standalone
RUN node_modules/.bin/prisma generate --schema=prisma/schema.prisma

# Stage 3: runner.
FROM node:24-slim AS runner

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs fastify

WORKDIR /app

COPY --from=build /standalone .
RUN chmod -R a-w .

USER fastify

ENV NODE_ENV=production

EXPOSE 3001

# Run pending migrations then start the server.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/server.js"]
