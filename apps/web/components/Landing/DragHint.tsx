'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hand } from 'lucide-react'

/*
  A one-time hint over the graph so users realise it is an interactive 3D scene.
  Fades out on the first pointer interaction, or after a few seconds if ignored.
*/
export function DragHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = () => setVisible(false)
    const timer = setTimeout(hide, 3000)
    window.addEventListener('pointerdown', hide, { once: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('pointerdown', hide)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          className="glass-chip pointer-events-none absolute left-1/2 top-[44%] z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            animate={{ x: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <Hand size={14} />
          </motion.span>
          Click and drag to explore
        </motion.div>
      )}
    </AnimatePresence>
  )
}
