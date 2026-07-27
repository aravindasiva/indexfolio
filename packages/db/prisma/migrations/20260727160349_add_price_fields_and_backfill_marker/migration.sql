/*
  Warnings:

  - Added the required column `adjClose` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_listingId_fkey";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "pricesBackfilledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "adjClose" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "source" TEXT,
ALTER COLUMN "date" SET DATA TYPE DATE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
