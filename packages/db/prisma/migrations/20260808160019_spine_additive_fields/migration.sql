-- CreateEnum
CREATE TYPE "ReplicationMethod" AS ENUM ('PHYSICAL_FULL', 'PHYSICAL_SAMPLING', 'SYNTHETIC');

-- AlterTable
ALTER TABLE "ETF" ADD COLUMN     "kidUrl" TEXT,
ADD COLUMN     "lei" TEXT,
ADD COLUMN     "replicationAsOf" TIMESTAMP(3),
ADD COLUMN     "replicationMethod" "ReplicationMethod",
ADD COLUMN     "terAsOf" TIMESTAMP(3),
ADD COLUMN     "terSourceUrl" TEXT,
ALTER COLUMN "ter" DROP NOT NULL,
ALTER COLUMN "fundSizeEur" DROP NOT NULL,
ALTER COLUMN "fundSize" DROP NOT NULL,
ALTER COLUMN "fundSizeCurrency" DROP NOT NULL;
