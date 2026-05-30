-- CreateTable
CREATE TABLE "ETF" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "isin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domicile" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "ter" DECIMAL(65,30) NOT NULL,
    "fundSizeEur" BIGINT NOT NULL,
    "isAccumulating" BOOLEAN NOT NULL,
    "isUcits" BOOLEAN NOT NULL,
    "indexTracked" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "inceptionDate" TIMESTAMP(3) NOT NULL,
    "kiidUrl" TEXT,
    "lastMetadataSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ETF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holding" (
    "id" TEXT NOT NULL,
    "etfId" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "country" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "asOfDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "etfId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineRun" (
    "id" TEXT NOT NULL,
    "pipeline" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "recordsProcessed" INTEGER,

    CONSTRAINT "PipelineRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ETF_ticker_key" ON "ETF"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "ETF_isin_key" ON "ETF"("isin");

-- CreateIndex
CREATE INDEX "Holding_etfId_asOfDate_idx" ON "Holding"("etfId", "asOfDate");

-- CreateIndex
CREATE INDEX "Price_etfId_date_idx" ON "Price"("etfId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Price_etfId_date_key" ON "Price"("etfId", "date");

-- CreateIndex
CREATE INDEX "ExchangeRate_date_fromCurrency_toCurrency_idx" ON "ExchangeRate"("date", "fromCurrency", "toCurrency");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_date_fromCurrency_toCurrency_key" ON "ExchangeRate"("date", "fromCurrency", "toCurrency");

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_etfId_fkey" FOREIGN KEY ("etfId") REFERENCES "ETF"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_etfId_fkey" FOREIGN KEY ("etfId") REFERENCES "ETF"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
