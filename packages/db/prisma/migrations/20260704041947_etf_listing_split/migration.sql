-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_etfId_fkey";

-- DropIndex
DROP INDEX "ETF_isin_ticker_key";

-- DropIndex
DROP INDEX "ETF_ticker_key";

-- DropIndex
DROP INDEX "Price_etfId_date_key";

-- AlterTable
ALTER TABLE "ETF" DROP COLUMN "currency",
DROP COLUMN "exchange",
DROP COLUMN "ticker",
ADD COLUMN     "fetchedAt" TIMESTAMP(3),
ADD COLUMN     "fundSize" BIGINT NOT NULL,
ADD COLUMN     "fundSizeCurrency" TEXT NOT NULL,
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "etfId",
ADD COLUMN     "listingId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "etfId" TEXT NOT NULL,
    "exchangeMic" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "yahooSymbol" TEXT,
    "source" TEXT,
    "fetchedAt" TIMESTAMP(3),

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "mic" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[],

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("mic")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[],

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_etfId_exchangeMic_currency_key" ON "Listing"("etfId", "exchangeMic", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_exchangeMic_ticker_key" ON "Listing"("exchangeMic", "ticker");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ETF_isin_key" ON "ETF"("isin");

-- CreateIndex
CREATE UNIQUE INDEX "Price_listingId_date_key" ON "Price"("listingId", "date");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_etfId_fkey" FOREIGN KEY ("etfId") REFERENCES "ETF"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_exchangeMic_fkey" FOREIGN KEY ("exchangeMic") REFERENCES "Exchange"("mic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

