import { useEffect, useState } from 'react'
import { random } from '@/lib/random'

// A handful of recognisable UCITS tickers from our catalogue. Purely decorative
// - the node always links into the ETF pages, which exist for each of these.
export const ETF_TICKERS = [
  'CSPX',
  'VUAA',
  'EQQQ',
  'CNDX',
  'IUSA',
  'AGGH',
  'VHYL',
  'SUSW',
] as const

/*
  Drives the ETF-detail node's "ETF <ticker>" label. The ticker swaps on an
  interval and `visible` pulses low->high around each swap, so callers can fade
  the ticker out, let it change while hidden, then fade the new one in.

  Starts on a random ticker (safe: the graphs only render client-side, so there
  is no server/client hydration mismatch).
*/
export function useFadingTicker(intervalMs = 4500, fadeMs = 300) {
  const [index, setIndex] = useState(() =>
    Math.floor(random() * ETF_TICKERS.length),
  )
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let swap: ReturnType<typeof globalThis.setTimeout>
    const cycle = globalThis.setInterval(() => {
      setVisible(false)
      swap = globalThis.setTimeout(() => {
        setIndex((current) => (current + 1) % ETF_TICKERS.length)
        setVisible(true)
      }, fadeMs)
    }, intervalMs)
    return () => {
      globalThis.clearInterval(cycle)
      globalThis.clearTimeout(swap)
    }
  }, [intervalMs, fadeMs])

  return { ticker: ETF_TICKERS[index] ?? ETF_TICKERS[0], visible }
}
