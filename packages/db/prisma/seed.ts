import { PrismaClient } from '@prisma/client'
import { etfs, exchanges, providers } from './data/etfs'

const prisma = new PrismaClient()

async function main() {
  await prisma.exchange.createMany({ data: exchanges, skipDuplicates: true })
  await prisma.provider.createMany({ data: providers, skipDuplicates: true })

  // Create each fund with its listings nested (exchanges must exist first for the FK).
  for (const { listings, ...etf } of etfs) {
    await prisma.eTF.create({
      data: {
        ...etf,
        source: 'seed',
        fetchedAt: new Date(),
        listings: { create: listings },
      },
    })
  }

  console.log(
    `Seeded ${exchanges.length} exchanges, ${providers.length} providers, ${etfs.length} ETFs`,
  )
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
