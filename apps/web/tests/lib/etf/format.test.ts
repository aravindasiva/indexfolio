import { describe, expect, it } from 'vitest'
import {
  formatFundSize,
  formatTer,
  fundTypeLabel,
} from '../../../lib/etf/format'

describe('formatTer', () => {
  it('renders the API fraction as a percentage', () => {
    expect(formatTer(0.0022)).toBe('0.22%')
    expect(formatTer(0.0059)).toBe('0.59%')
    expect(formatTer(0.001)).toBe('0.10%')
  })
})

describe('formatFundSize', () => {
  it('formats billions, millions and thousands', () => {
    expect(formatFundSize('46200000000')).toBe('€46.2B')
    expect(formatFundSize('890000000')).toBe('€890M')
    expect(formatFundSize('216000000')).toBe('€216M')
    expect(formatFundSize('5000')).toBe('€5K')
  })

  it('handles zero and non-numeric input', () => {
    expect(formatFundSize('0')).toBe('-')
    expect(formatFundSize('not-a-number')).toBe('-')
  })
})

describe('fundTypeLabel', () => {
  it('maps the accumulating flag', () => {
    expect(fundTypeLabel(true)).toBe('Acc')
    expect(fundTypeLabel(false)).toBe('Dist')
  })
})
