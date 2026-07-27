import { vi } from 'vitest'
import { Prisma, type PrismaClient } from '@indexfolio/db'

const mockExchange = { mic: 'XETR', name: 'Xetra', aliases: ['XETRA'] }

const mockPrimaryListing = {
  id: 'listing1',
  etfId: 'cuid1',
  exchangeMic: 'XETR',
  ticker: 'VWCE',
  currency: 'EUR',
  isPrimary: true,
  yahooSymbol: null,
  source: 'seed',
  fetchedAt: null,
  pricesBackfilledAt: null,
  exchange: mockExchange,
}

// A fund with its primary listing included (the shape getEtfs/serializeEtf work with).
export const mockEtf = {
  id: 'cuid1',
  isin: 'IE00BK5BQT80',
  name: 'Vanguard FTSE All-World UCITS ETF (Acc)',
  domicile: 'IE',
  ter: new Prisma.Decimal(0.0022),
  fundSize: 20000000000n,
  fundSizeCurrency: 'USD',
  fundSizeEur: 46200000000n,
  isAccumulating: true,
  isUcits: true,
  indexTracked: 'FTSE All-World',
  assetClass: 'EQUITY',
  provider: 'Vanguard',
  inceptionDate: new Date('2019-07-23T00:00:00.000Z'),
  kiidUrl: null,
  source: 'seed',
  fetchedAt: null,
  lastMetadataSync: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  listings: [mockPrimaryListing],
}

// What listing.findFirst returns for getEtfByTicker: the listing with its fund.
export const mockListingWithEtf = { ...mockPrimaryListing, etf: mockEtf }

// A fund listed on several venues with DIFFERENT local tickers - exercises listings[],
// matchedTicker, currencies[] and exchangeCount.
const parisListing = {
  id: 'l-par',
  etfId: 'cuid2',
  exchangeMic: 'XPAR',
  ticker: 'MWRD',
  currency: 'EUR',
  isPrimary: true,
  yahooSymbol: null,
  source: 'seed',
  fetchedAt: null,
  pricesBackfilledAt: null,
  exchange: { mic: 'XPAR', name: 'Euronext Paris', aliases: [] },
}
const xetraListing = {
  ...parisListing,
  id: 'l-xetr',
  exchangeMic: 'XETR',
  ticker: 'MWRE',
  isPrimary: false,
  exchange: { mic: 'XETR', name: 'Xetra', aliases: [] },
}
const londonListing = {
  ...parisListing,
  id: 'l-lon',
  exchangeMic: 'XLON',
  ticker: 'MWRL',
  currency: 'GBP',
  isPrimary: false,
  exchange: { mic: 'XLON', name: 'London Stock Exchange', aliases: [] },
}

export const mockMultiEtf = {
  ...mockEtf,
  id: 'cuid2',
  isin: 'LU1681043599',
  name: 'Amundi Core MSCI World UCITS ETF Acc',
  provider: 'Amundi',
  listings: [parisListing, xetraListing, londonListing],
}

// Resolved via a NON-primary ticker (MWRL on London): matchedTicker should be MWRL, ticker MWRD.
export const mockMultiListingWithEtf = { ...londonListing, etf: mockMultiEtf }

export const mockDb = {
  eTF: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  listing: {
    findFirst: vi.fn(),
  },
} as unknown as PrismaClient
