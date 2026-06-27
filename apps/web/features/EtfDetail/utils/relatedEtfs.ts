type RelatedFields = { ticker: string; indexTracked: string }

/*
  Pick related ETFs from a pool (already narrowed to the same asset class):
  same-index funds first, then the rest, excluding the current ETF, capped at
  `limit`. Pure, so it is unit-tested.
*/
export function selectRelated<T extends RelatedFields>(
  current: T,
  pool: T[],
  limit: number,
): T[] {
  const candidates = pool.filter((etf) => etf.ticker !== current.ticker)
  const sameIndex = candidates.filter(
    (etf) => etf.indexTracked === current.indexTracked,
  )
  const others = candidates.filter(
    (etf) => etf.indexTracked !== current.indexTracked,
  )
  return [...sameIndex, ...others].slice(0, limit)
}
