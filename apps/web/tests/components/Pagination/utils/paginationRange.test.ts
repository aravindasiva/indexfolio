import { describe, expect, it } from 'vitest'
import { paginationRange } from '../../../../components/Pagination/utils/paginationRange'

describe('paginationRange', () => {
  it('lists every page when there are 7 or fewer', () => {
    expect(paginationRange(1, 3)).toEqual([1, 2, 3])
    expect(paginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('shows a window around the current page with gaps', () => {
    expect(paginationRange(5, 10)).toEqual([
      1,
      'ellipsis-left',
      4,
      5,
      6,
      'ellipsis-right',
      10,
    ])
  })

  it('omits the leading gap near the start', () => {
    expect(paginationRange(2, 10)).toEqual([1, 2, 3, 'ellipsis-right', 10])
  })

  it('omits the trailing gap near the end', () => {
    expect(paginationRange(9, 10)).toEqual([1, 'ellipsis-left', 8, 9, 10])
  })

  it('always includes first and last', () => {
    const range = paginationRange(5, 20)
    expect(range[0]).toBe(1)
    expect(range[range.length - 1]).toBe(20)
  })
})
