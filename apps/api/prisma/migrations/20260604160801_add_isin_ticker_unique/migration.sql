/*
  Warnings:

  - A unique constraint covering the columns `[isin,ticker]` on the table `ETF` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ETF_isin_key";

-- CreateIndex
CREATE UNIQUE INDEX "ETF_isin_ticker_key" ON "ETF"("isin", "ticker");
