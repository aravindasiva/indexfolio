# Indexfolio

> Free, open-source toolkit for EU passive investors.

**indexfolio.dev** — ETF screener, tax calculators, portfolio 
overlap analyser, and investing education. Built for European 
retail investors who want to make informed decisions without 
paying for advice.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Status: Building](https://img.shields.io/badge/Status-Building-orange.svg)

---

## What it does

- **ETF Screener** — filter UCITS ETFs by exchange, domicile, 
  TER, accumulating/distributing
- **Tax Calculator** — country-specific after-tax projections 
  (Portugal first, more countries coming)
- **Portfolio Overlap Analyser** — see what you actually own 
  across multiple ETFs
- **Knowledge Graph** — interactive map of investing concepts 
  and how they connect

---

## Disclaimer

This tool provides educational information and calculations only.
Nothing here constitutes financial advice. Always do your own 
research and consult a qualified financial advisor before making 
investment decisions.

---

## Stack

Next.js · TypeScript · Fastify · Prisma · Temporal · 
PostgreSQL · Tailwind · shadcn/ui · Recharts · D3

---

## Getting started (local)

```bash
# Clone the repo
git clone https://github.com/aravindasiva/indexfolio.git
cd indexfolio

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Run development server
pnpm dev
```

---

## Contributing

Contributions are welcome. Please read 
[CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

The most valuable contributions right now:
- Adding country tax modules (Germany, Netherlands, Spain, etc.)
- ETF data corrections
- UI improvements
- Bug fixes

---

## Support this project

This project is maintained by 
[@aravindasiva](https://github.com/aravindasiva).
Donations go directly to cover hosting costs (~$10/month).

- [GitHub Sponsors](https://github.com/sponsors/aravindasiva)
- [Ko-fi](https://ko-fi.com/aravindasiva)

Forks of this project are not affiliated with the official 
project and have separate maintainers.

---

## License

[MIT](./LICENSE) — free to use, modify, and distribute.
