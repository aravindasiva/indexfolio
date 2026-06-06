import { vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'

export const mockEtf = {
  id: 'cuid1',
  ticker: 'VWCE',
  name: 'Vanguard FTSE All-World UCITS ETF Acc',
  isin: 'IE00B3RBWM25',
  domicile: 'IE',
  exchange: 'XETRA',
  currency: 'EUR',
  ter: 0.0022,
  fundSizeEur: 46200000000n,
  isAccumulating: true,
  isUcits: true,
  indexTracked: 'FTSE All-World',
  assetClass: 'EQUITY',
  provider: 'VANGUARD',
  inceptionDate: new Date('2019-07-23T00:00:00.000Z'),
  kiidUrl: null,
  lastMetadataSync: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockDb = {
  eTF: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
  },
} as unknown as PrismaClient
