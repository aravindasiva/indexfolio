# Indexfolio

> Open-source tools for European passive investors. Filter UCITS ETFs, run the numbers, and understand what you actually own.

[![CI](https://github.com/aravindasiva/indexfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/aravindasiva/indexfolio/actions/workflows/ci.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=aravindasiva_indexfolio&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=aravindasiva_indexfolio)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/aravindasiva/indexfolio?style=social)](https://github.com/aravindasiva/indexfolio/stargazers)

Indexfolio is a free, open-source toolkit for navigating passive investing in Europe. An ETF screener that actually understands UCITS, accumulating vs distributing funds, TERs, domiciles, and all the other things that matter to EU retail investors. No account. No paywall. No upsell.

Built first for Portugal. Expanding to the rest of the EU as the project grows.

---

## What's here

| Tool                       | Status   | Description                                                                                     |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| ETF Screener               | **Live** | Filter UCITS-compliant ETFs by TER, domicile, accumulating/distributing, fund size, asset class |
| Tax Calculator             | Planned  | After-tax projections using actual country tax rules, not generic estimates                     |
| Portfolio Overlap Analyser | Planned  | See what you actually own when combining multiple ETFs                                          |
| Knowledge Graph            | Planned  | An interactive map of how investing concepts connect                                            |

---

## Architecture

```mermaid
graph LR
    subgraph vercel["☁️  Vercel"]
        Web(["Next.js 16\nfrontend"])
    end
    subgraph railway["🚂  Railway"]
        API(["Fastify v5\nREST API"])
    end
    subgraph neon["🗄️  Neon"]
        DB[("PostgreSQL\nPrisma 6")]
    end
    subgraph upstash["⚡  Upstash"]
        Cache[("Redis\ncache")]
    end

    Web -- "REST" --> API
    API -- "queries" --> DB
    API -- "cache" --> Cache
```

---

## Stack

| Layer    | Tech                                |
| -------- | ----------------------------------- |
| Frontend | Next.js 16, Tailwind CSS, shadcn/ui |
| API      | Fastify v5, Zod, TypeScript strict  |
| Database | PostgreSQL (Neon), Prisma 6         |
| Cache    | Redis (Upstash)                     |
| Monorepo | Turborepo, pnpm workspaces          |
| Infra    | Vercel (web), Railway (API)         |
| Testing  | Vitest                              |

---

## Run it locally

**Prerequisites:** Node.js 20+, pnpm, Docker

```bash
# 1. Clone and install dependencies
git clone https://github.com/aravindasiva/indexfolio.git
cd indexfolio
pnpm install

# 2. Set up the API environment
cp .env.example apps/api/.env

# 3. Start Postgres and Redis
pnpm docker:up

# 4. Run migrations and seed ETF data
pnpm --filter @indexfolio/api prisma:migrate
pnpm --filter @indexfolio/api prisma:seed

# 5. Start everything
pnpm dev
```

| Service            | URL                        |
| ------------------ | -------------------------- |
| Web                | http://localhost:3000      |
| API                | http://localhost:3001      |
| API docs (Swagger) | http://localhost:3001/docs |

To stop: `pnpm docker:down`

---

## Contributing

PRs are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening one - it is short and covers everything you need.

The most valuable contribution right now is a **country tax module**. If you live in an EU country and can verify your country's ETF tax rules against official government sources, that is the thing that helps the most people. Check the open issues for the spec.

Got questions or ideas? Drop them in [GitHub Discussions](https://github.com/aravindasiva/indexfolio/discussions). Issues are for bugs and concrete feature requests only.

If this is useful to you, a [star](https://github.com/aravindasiva/indexfolio/stargazers) helps other investors find it.

### How a contribution flows

Open your PR to `dev` (never `main`). Here is what happens next:

```mermaid
flowchart TD
    PR(["📬 Open PR → dev"]):::blue --> CI["🧪 CI Suite\nformat · lint · typecheck · test · build · SonarQube"]:::yellow
    CI -- "❌ fails" --> Fix(["🔧 fix it and push again"]):::red
    Fix --> CI
    CI -- "✅ passes" --> Review(["👀 maintainer reviews"]):::blue
    Review -- "approved" --> Merged(["merged to dev ✅"]):::blue
    Merged --> Bossman{{"🤖 Bossman\ndetects what changed"}}:::gray
    Bossman -- "API files changed" --> Staging(["🚢 API → Railway staging"]):::green
    Bossman -- "web files changed" --> Preview(["🚀 web → Vercel preview"]):::green
    Staging & Preview -- "stable" --> Main(["dev → main\nmaintainer's call"]):::blue
    Main --> Prod(["🏁 API → Railway prod + web → Vercel prod"]):::purple

    classDef blue fill:#dbeafe,stroke:#3b82f6,color:#1e40af
    classDef yellow fill:#fef9c3,stroke:#eab308,color:#713f12
    classDef red fill:#fee2e2,stroke:#ef4444,color:#991b1b
    classDef green fill:#dcfce7,stroke:#22c55e,color:#166534
    classDef gray fill:#f3f4f6,stroke:#9ca3af,color:#374151
    classDef purple fill:#f3e8ff,stroke:#a855f7,color:#6b21a8
```

Once your PR is green and approved, the rest is automatic. Deployments to staging happen on merge to `dev`, and production happens when `dev` gets merged to `main`.

### What we care about

- **TypeScript strict is on.** No `any`, no bullshit workarounds. If you are fighting the types, rethink the approach.
- **New logic needs tests.** Feature? Write tests. Bug fix? Write a regression test.
- **The bar only goes up.** A PR that adds something useful but weakens types or skips tests will not land. That is not gatekeeping, it is just how a solo-maintained project stays alive.

Full details in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Contributors

Thanks to everyone who has contributed. ([emoji key](https://allcontributors.org/docs/en/emoji-key))

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## Support

Indexfolio is free and always will be. Running costs come out of pocket (hosting, DB, Redis - roughly $10/month).

If it is useful to you and you want to help keep it running:

- [GitHub Sponsors](https://github.com/sponsors/aravindasiva) - recurring support via GitHub
- [Ko-fi](https://ko-fi.com/aravindasiva) - one-time or recurring

All support goes to infrastructure. The project will never be monetised.

---

## Disclaimer

Educational information and calculations only. Nothing here is financial advice. Make your own decisions. Consult a qualified professional if you need one.

---

## License

[MIT](./LICENSE) - use it, modify it, build on it.
