import type { Transition, Variants } from 'framer-motion'

/*
  The app's shared motion language: tune a value here and it propagates everywhere.
  Reduced-motion is honored automatically via <MotionConfig reducedMotion="user">
  in RootContainer, so these values can be playful without hurting anyone.
*/

// The house spring for interactions. Snappy with a hint of overshoot.
export const spring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 26,
}

// A softer, heavier spring for larger entrances (panels, headings, list items).
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
}

// Tactile feedback for anything clickable. Spread onto a motion element:
// <motion.button {...tactile}>.
export const tactile = {
  whileHover: { y: -2, scale: 1.03 },
  whileTap: { scale: 0.95 },
  transition: spring,
} as const

// Fade + rise for an item inside a staggered list, so the cascade stays tight.
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: spring },
}

// Wrap `fadeUpItem` children in a motion element carrying this variant
// (initial="hidden" animate="show") to cascade them in one by one.
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}
