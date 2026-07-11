'use client'

import { useEffect, useState } from 'react'
import { useKonamiCode } from '@/hooks/useKonamiCode'
import { useLooseCat, setLooseCat } from '@/lib/looseCat'
import { FloatingCat } from '@/components/FloatingCat/FloatingCat'

// App-wide cat egg: the Konami code (or a CatTap on touch) unlocks it, then the cat drifts over the
// viewport and persists across pages until clicked away. Mounted once in RootContainer.
export function KonamiCat() {
  const loose = useLooseCat()
  const [area, setArea] = useState({ width: 0, height: 0 })

  useKonamiCode(() => setLooseCat(true))

  // While loose, the whole UI wears retro fonts (styles/egg.css).
  useEffect(() => {
    document.documentElement.classList.toggle('egg-loose', loose)
  }, [loose])

  useEffect(() => {
    if (!loose) return
    const measure = () =>
      setArea({ width: globalThis.innerWidth, height: globalThis.innerHeight })
    measure()
    globalThis.addEventListener('resize', measure)
    return () => globalThis.removeEventListener('resize', measure)
  }, [loose])

  if (!loose || area.width === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <FloatingCat size={80} area={area} onLeave={() => setLooseCat(false)} />
    </div>
  )
}
