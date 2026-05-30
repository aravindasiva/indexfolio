# Indexfolio

**Free. Open source. No bullshit.**

A toolkit for EU passive investors who want to make better decisions without paying someone to think for them.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Status: Building](https://img.shields.io/badge/Status-Building-orange.svg)](https://github.com/aravindasiva/indexfolio)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5f5f?logo=ko-fi)](https://ko-fi.com/aravindasiva)

---

## What this is

A set of tools built for EU retail investors navigating a landscape designed to confuse them.

- **ETF Screener** - filter UCITS ETFs that actually make sense for EU investors
- **Tax Calculator** - real after-tax projections using actual country tax rules, not fantasy numbers
- **Portfolio Overlap Analyser** - find out what you actually own when you combine ETFs
- **Knowledge Graph** - an interactive map of how investing concepts connect

Built first for Portugal. Expanding to the rest of the EU as knowledge grows.

---

## What this is not

- Financial advice. Not now, not ever. Read the disclaimer.
- A SaaS trying to upsell you something.
- A platform collecting your data.
- A project that will add features just because someone asked nicely.

---

## Disclaimer

This tool provides educational information and calculations only. Nothing here is financial advice. Make your own decisions. Consult a professional if you need one.

---

## Stack

Next.js - TypeScript - Fastify - Prisma - Temporal - PostgreSQL - Tailwind - shadcn/ui - Recharts - D3

---

## Run it locally

```bash
git clone https://github.com/aravindasiva/indexfolio.git
cd indexfolio
pnpm install
cp .env.example .env
pnpm dev
```

---

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening anything.

Short version: PRs go to `dev`, not `main`. CI must pass. One approval required. Screenshots for UI changes. No exceptions.

The most useful thing you can contribute right now is a country tax module. If you know your country's tax rules for ETF investors and can verify them against official sources - that is the contribution that helps the most people.

---

## How this project runs

This is a solo-maintained open source project. That means:

- PRs get reviewed when they get reviewed. Usually within a week.
- Features get built when they make sense, not because of demand.
- Decisions are made by the maintainer. Discussion is welcome. Entitlement is not.
- If you don't like how something works, open an issue. If you still don't like it after that, fork it.

This is not a democracy. It is an open source project with one maintainer who has strong opinions about what belongs here and what does not.

---

## What gets you removed

- Harassment of any kind toward any contributor or maintainer
- Opening PRs that ignore the contribution guidelines after being told once
- Using project spaces to give or solicit financial advice
- Spamming issues or discussions with off-topic content

No warnings for the first three. Instant ban.

---

## Support

This project costs ~$10/month to run. If it is useful to you, you can help cover that.

- [Ko-fi](https://ko-fi.com/aravindasiva) - one-time or recurring
- [GitHub Sponsors](https://github.com/sponsors/aravindasiva) - via GitHub directly

Donations go to hosting costs only. The project will always be free.

Forks of this project are not affiliated with the official project at [indexfolio.dev](https://indexfolio.dev).

---

## License

[MIT](./LICENSE) - use it, modify it, build on it. Just don't pretend you made it.
