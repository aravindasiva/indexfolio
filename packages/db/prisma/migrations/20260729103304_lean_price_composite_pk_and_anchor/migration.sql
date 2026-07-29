/*
  Warnings:

  - The primary key for the `Price` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Price` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Price_listingId_date_key";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "isPriceAnchor" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Price" DROP CONSTRAINT "Price_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Price_pkey" PRIMARY KEY ("listingId", "date");
