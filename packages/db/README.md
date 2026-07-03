# @indexfolio/db

> The Prisma schema, migrations, and typed client behind [Indexfolio](https://www.indexfolio.dev) - open-source tools for European passive investors.

[![npm](https://img.shields.io/npm/v/@indexfolio/db?logo=npm)](https://www.npmjs.com/package/@indexfolio/db)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/aravindasiva/indexfolio/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

This package is the single source of truth for the Indexfolio data model: the
[Prisma](https://www.prisma.io) schema, its full migration history, and the
generated, fully-typed client. The Indexfolio API and data pipelines both import
from here, so the shape of the data lives in exactly one place.

## What is Indexfolio?

[Indexfolio](https://www.indexfolio.dev) is a free, open-source toolkit for
passive investing in Europe: an ETF screener that actually understands UCITS,
accumulating vs distributing funds, TERs, domiciles, and the details EU retail
investors care about. No account, no paywall, no upsell.

- 🌐 App: <https://www.indexfolio.dev>
- 📦 Source: <https://github.com/aravindasiva/indexfolio>

## Install

```bash
pnpm add @indexfolio/db
# or: npm install @indexfolio/db
```

`@prisma/client` ships as a dependency, and `prisma generate` runs on install to
build the client for your platform.

## Usage

Import the client and the model types straight from `@indexfolio/db` - you never
touch `@prisma/client` directly:

```ts
import { PrismaClient } from '@indexfolio/db'

const db = new PrismaClient()

const etfs = await db.eTF.findMany({
  where: { isUcits: true, isAccumulating: true },
})
```

Enums and helper types come from the same entry point:

```ts
import { Prisma, type ETF } from '@indexfolio/db'

const ter = new Prisma.Decimal(0.0022)
```

## What's inside

- `prisma/schema.prisma` - the data model (ETFs, holdings, prices, FX rates, pipeline runs)
- `prisma/migrations` - the full, ordered migration history
- `dist` - the compiled, typed client entry point

## Applying migrations

Point Prisma at the bundled schema to apply migrations from a consuming app:

```bash
prisma migrate deploy --schema node_modules/@indexfolio/db/prisma/schema.prisma
```

## License

MIT (c) [aravindasiva](https://github.com/aravindasiva). See [LICENSE](https://github.com/aravindasiva/indexfolio/blob/main/LICENSE).
