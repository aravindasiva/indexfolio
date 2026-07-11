'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { setLooseCat } from '@/lib/looseCat'

const TAPS = 5
const WINDOW_MS = 2000

// Touch trigger for the cat egg: five quick taps unlock it. A raw click listener (not JSX) keeps it
// hidden and out of the a11y tree.
export function CatTap({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let count = 0
    let last = 0
    const onClick = () => {
      const now = Date.now()
      count = now - last < WINDOW_MS ? count + 1 : 1
      last = now
      if (count >= TAPS) {
        count = 0
        setLooseCat(true)
      }
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [])

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  )
}
