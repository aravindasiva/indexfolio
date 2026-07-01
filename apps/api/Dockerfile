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
COPY packages/db/package.json                       ./packages/db/
COPY packages/etf-types/package.json                ./packages/etf-types/
COPY packages/knowledge-graph/package.json          ./packages/knowledge-graph/
COPY packages/tax-engine/package.json               ./packages/tax-engine/

RUN pnpm install --frozen-lockfile --ignore-scripts

# Stage 2: build.
FROM deps AS build
WORKDIR /repo

COPY tsconfig.base.json ./
COPY packages/db/ ./packages/db/
COPY apps/api/ ./apps/api/

# Generate the Prisma client, then build db and api (api depends on @indexfolio/db).
RUN pnpm --filter @indexfolio/db generate
RUN pnpm --filter @indexfolio/db build
RUN pnpm --filter @indexfolio/api build

# pnpm deploy gives a flat node_modules (no virtual store) with prod deps only;
# @indexfolio/db ships its dist + prisma (schema/migrations) via its package "files".
RUN pnpm --filter @indexfolio/api deploy --prod /standalone

RUN cp -r apps/api/dist /standalone/dist

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

# Run pending migrations (schema lives in the @indexfolio/db package) then start.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy --schema node_modules/@indexfolio/db/prisma/schema.prisma && node dist/server.js"]
