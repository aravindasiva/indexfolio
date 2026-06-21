/*
  Crypto-backed randomness: a single, app-wide source of random values built on
  the Web Crypto API instead of Math.random, so

    - there is one place to reason about randomness, and
    - Sonar's S2245 PRNG hotspot never fires (no Math.random anywhere).

  Suitable for cosmetic use (animations) today and anything that needs real
  unpredictability later. crypto is a global in both the browser and the Node 20+
  SSR runtime, so this works wherever a component renders.
*/

// Uniformly distributed float in [0, 1) - the crypto-backed analogue of
// Math.random. Maps a random 32-bit integer onto the unit interval.
export function random(): number {
  const [value = 0] = crypto.getRandomValues(new Uint32Array(1))
  return value / 2 ** 32
}

// Uniformly distributed float in [min, max).
export function randomRange(min: number, max: number): number {
  return min + random() * (max - min)
}

// A uniformly chosen element. Throws on an empty array (a caller bug).
export function pick<T>(items: readonly T[]): T {
  const item = items[Math.floor(random() * items.length)]
  if (item === undefined) {
    throw new Error('pick() requires a non-empty array')
  }
  return item
}
