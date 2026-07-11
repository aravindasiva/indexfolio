'use client'

import { Children, isValidElement, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUpItem, staggerContainer } from '@/lib/motion'

// Cascades its children up-and-in on mount (the screener's fadeUp). Children stay server-rendered -
// passed in and wrapped here - so a server page animates without becoming a client component.
export function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <motion.div variants={fadeUpItem}>{child}</motion.div>
        ) : (
          child
        ),
      )}
    </motion.div>
  )
}
