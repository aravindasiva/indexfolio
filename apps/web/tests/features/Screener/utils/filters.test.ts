import { describe, expect, it } from 'vitest'
import {
  filtersToParams,
  type ScreenerFilters,
} from '../../../../features/Screener/utils/filters'

const base: ScreenerFilters = {
  search: '',
  assetClass: '',
  type: null,
  domicile: [],
  exchange: [],
  maxTer: null,
  minFundSize: null,
  sort: 'fundSizeEur',
  order: 'desc',
  page: 1,
}

describe('filtersToParams', () => {
  it('omits everything but page/sort/order at defaults', () => {
    expect(filtersToParams(base)).toEqual({
      page: 1,
      search: undefined,
      assetClass: undefined,
      isAccumulating: undefined,
      domicile: undefined,
      exchange: undefined,
      maxTer: undefined,
      minFundSize: undefined,
      sort: 'fundSizeEur',
      order: 'desc',
    })
  })

  it('maps type acc/dist to isAccumulating', () => {
    expect(filtersToParams({ ...base, type: 'acc' }).isAccumulating).toBe(true)
    expect(filtersToParams({ ...base, type: 'dist' }).isAccumulating).toBe(
      false,
    )
  })

  it('converts the TER percent to a fraction for the API', () => {
    expect(filtersToParams({ ...base, maxTer: 0.5 }).maxTer).toBe(0.005)
  })

  it('joins multi-select arrays into comma strings', () => {
    const params = filtersToParams({
      ...base,
      domicile: ['IE', 'LU'],
      exchange: ['XETRA'],
    })
    expect(params.domicile).toBe('IE,LU')
    expect(params.exchange).toBe('XETRA')
  })

  it('trims search and drops it when blank', () => {
    expect(filtersToParams({ ...base, search: '  vwce ' }).search).toBe('vwce')
    expect(filtersToParams({ ...base, search: '   ' }).search).toBeUndefined()
  })

  it('serializes minFundSize as a string', () => {
    expect(
      filtersToParams({ ...base, minFundSize: 1000000000 }).minFundSize,
    ).toBe('1000000000')
  })
})
