import { PrismaClient } from '@prisma/client'
import { etfSeedData } from './data/etfs'

const prisma = new PrismaClient()

async function main() {
  await prisma.eTF.createMany({ data: etfSeedData, skipDuplicates: true })
  console.log(`Seeded ${etfSeedData.length} ETFs`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
