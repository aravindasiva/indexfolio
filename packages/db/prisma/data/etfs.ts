// Local dev seed data (NOT used in staging/prod - real data comes from the engine).
// A small, real-ish slice so the screener and detail pages have something to render.
// TER is a fraction (0.0022 = 0.22%); fund sizes are whole currency units as BigInt.

export const exchanges = [
  { mic: 'XETR', name: 'Xetra', aliases: ['XETRA', 'Deutsche Boerse Xetra'] },
  { mic: 'XLON', name: 'London Stock Exchange', aliases: ['London', 'LSE'] },
  { mic: 'XAMS', name: 'Euronext Amsterdam', aliases: ['Amsterdam'] },
  { mic: 'XMIL', name: 'Borsa Italiana', aliases: ['Milan'] },
]

export const providers = [
  { name: 'iShares', aliases: ['BlackRock'] },
  { name: 'Vanguard', aliases: [] as string[] },
  { name: 'Amundi', aliases: ['Lyxor'] },
]

// Each fund carries its listings; exactly one listing per fund is isPrimary (what the
// screener and detail header show).
export const etfs = [
  {
    isin: 'IE00BK5BQT80',
    name: 'Vanguard FTSE All-World UCITS ETF (Acc)',
    domicile: 'IE',
    ter: 0.0022,
    fundSize: 20_000_000_000n,
    fundSizeCurrency: 'USD',
    fundSizeEur: 18_500_000_000n,
    isAccumulating: true,
    isUcits: true,
    indexTracked: 'FTSE All-World',
    assetClass: 'EQUITY',
    provider: 'Vanguard',
    inceptionDate: new Date('2019-07-23'),
    listings: [
      { exchangeMic: 'XETR', ticker: 'VWCE', currency: 'EUR', isPrimary: true },
      {
        exchangeMic: 'XLON',
        ticker: 'VWRP',
        currency: 'GBP',
        isPrimary: false,
      },
    ],
  },
  {
    isin: 'IE00B4L5Y983',
    name: 'iShares Core MSCI World UCITS ETF (Acc)',
    domicile: 'IE',
    ter: 0.002,
    fundSize: 98_000_000_000n,
    fundSizeCurrency: 'USD',
    fundSizeEur: 90_000_000_000n,
    isAccumulating: true,
    isUcits: true,
    indexTracked: 'MSCI World',
    assetClass: 'EQUITY',
    provider: 'iShares',
    inceptionDate: new Date('2009-09-25'),
    listings: [
      { exchangeMic: 'XETR', ticker: 'EUNL', currency: 'EUR', isPrimary: true },
      {
        exchangeMic: 'XAMS',
        ticker: 'IWDA',
        currency: 'USD',
        isPrimary: false,
      },
    ],
  },
  {
    isin: 'IE00B5BMR087',
    name: 'iShares Core S&P 500 UCITS ETF (Acc)',
    domicile: 'IE',
    ter: 0.0007,
    fundSize: 98_000_000_000n,
    fundSizeCurrency: 'USD',
    fundSizeEur: 90_000_000_000n,
    isAccumulating: true,
    isUcits: true,
    indexTracked: 'S&P 500',
    assetClass: 'EQUITY',
    provider: 'iShares',
    inceptionDate: new Date('2010-05-19'),
    listings: [
      { exchangeMic: 'XETR', ticker: 'SXR8', currency: 'EUR', isPrimary: true },
      {
        exchangeMic: 'XLON',
        ticker: 'CSPX',
        currency: 'USD',
        isPrimary: false,
      },
    ],
  },
  {
    isin: 'IE00BKM4GZ66',
    name: 'iShares Core MSCI EM IMI UCITS ETF (Acc)',
    domicile: 'IE',
    ter: 0.0018,
    fundSize: 24_000_000_000n,
    fundSizeCurrency: 'USD',
    fundSizeEur: 22_000_000_000n,
    isAccumulating: true,
    isUcits: true,
    indexTracked: 'MSCI Emerging Markets IMI',
    assetClass: 'EQUITY',
    provider: 'iShares',
    inceptionDate: new Date('2014-05-30'),
    listings: [
      { exchangeMic: 'XETR', ticker: 'IS3N', currency: 'EUR', isPrimary: true },
    ],
  },
  {
    isin: 'LU0908500753',
    name: 'Amundi Stoxx Europe 600 UCITS ETF (Acc)',
    domicile: 'LU',
    ter: 0.0007,
    fundSize: 19_000_000_000n,
    fundSizeCurrency: 'EUR',
    fundSizeEur: 19_000_000_000n,
    isAccumulating: true,
    isUcits: true,
    indexTracked: 'STOXX Europe 600',
    assetClass: 'EQUITY',
    provider: 'Amundi',
    inceptionDate: new Date('2013-04-24'),
    listings: [
      { exchangeMic: 'XETR', ticker: 'MEUD', currency: 'EUR', isPrimary: true },
    ],
  },
  {
    isin: 'IE00BDBRDM35',
    name: 'iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)',
    domicile: 'IE',
    ter: 0.001,
    fundSize: 6_000_000_000n,
    fundSizeCurrency: 'EUR',
    fundSizeEur: 6_000_000_000n,
    isAccumulating: true,
    isUcits: true,
    indexTracked: 'Bloomberg Global Aggregate Bond',
    assetClass: 'BOND',
    provider: 'iShares',
    inceptionDate: new Date('2017-11-21'),
    listings: [
      { exchangeMic: 'XMIL', ticker: 'AGGH', currency: 'EUR', isPrimary: true },
    ],
  },
]
