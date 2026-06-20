'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/*
  "Scroll to explore" cue, just above the global disclaimer. Smooth-scrolls to
  the tools section on click, and fades out once the user starts scrolling.
*/
export function ScrollHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 24) setVisible(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTools() {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTools}
          aria-label="Scroll to explore the tools"
          className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
