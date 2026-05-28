import type { PortugalTaxConfig } from './countries/portugal.js'
import { PORTUGAL_TAX } from './countries/portugal.js'

export type CountryCode = 'PT'
export type CountryConfig = PortugalTaxConfig

const registry = {
  PT: PORTUGAL_TAX,
} satisfies Record<CountryCode, CountryConfig>

export function getCountry(code: CountryCode): CountryConfig {
  const config = (registry as Record<string, CountryConfig | undefined>)[code]
  if (config === undefined) {
    throw new Error(`Country code "${code}" is not registered in the tax engine`)
  }
  return config
}
