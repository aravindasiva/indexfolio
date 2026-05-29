import { describe, expect, it } from 'vitest'
import { PORTUGAL_TAX } from '../countries/portugal.js'
import { getCountry } from '../registry.js'

describe('PORTUGAL_TAX', () => {
  it('has a flat rate of 28%', () => {
    expect(PORTUGAL_TAX.flatRate).toBe(0.28)
  })

  it('has 4 holding period discount brackets', () => {
    expect(PORTUGAL_TAX.holdingDiscounts).toHaveLength(4)
  })

  it('bracket 0: 0-2 years at 28%', () => {
    expect(PORTUGAL_TAX.holdingDiscounts[0]).toEqual({ minYears: 0, maxYears: 2, rate: 0.28 })
  })

  it('bracket 1: 2-5 years at 26.5%', () => {
    expect(PORTUGAL_TAX.holdingDiscounts[1]).toEqual({ minYears: 2, maxYears: 5, rate: 0.265 })
  })

  it('bracket 2: 5-8 years at 24%', () => {
    expect(PORTUGAL_TAX.holdingDiscounts[2]).toEqual({ minYears: 5, maxYears: 8, rate: 0.24 })
  })

  it('bracket 3: 8+ years at 19.6% (Law 31/2024 long-hold discount)', () => {
    expect(PORTUGAL_TAX.holdingDiscounts[3]).toEqual({
      minYears: 8,
      maxYears: Infinity,
      rate: 0.196,
    })
  })

  it('uses FIFO lot assignment method', () => {
    expect(PORTUGAL_TAX.method).toBe('FIFO')
  })

  it('uses Modelo 3 annual form', () => {
    expect(PORTUGAL_TAX.annualForm).toBe('Modelo 3')
  })

  it('uses Anexo G for capital gains', () => {
    expect(PORTUGAL_TAX.annexCapitalGains).toBe('Anexo G')
  })

  it('uses Anexo J for foreign income', () => {
    expect(PORTUGAL_TAX.annexForeignIncome).toBe('Anexo J')
  })
})

describe('getCountry', () => {
  it('returns the Portugal config for PT', () => {
    expect(getCountry('PT')).toBe(PORTUGAL_TAX)
  })

  it('throws for an unregistered country code', () => {
    // @ts-expect-error - testing runtime guard with an unregistered code
    expect(() => getCountry('DE')).toThrow('Country code "DE" is not registered in the tax engine')
  })
})
