import type { Transition, Variants } from 'framer-motion'

/*
  The app's shared motion language. Importing these everywhere is what makes the
  whole product feel like one thing: the same spring, the same entrance, the same
  tactile press on every clickable surface. Tune a value here and it propagates.

  All of this respects the user's reduced-motion setting automatically, via
  <MotionConfig reducedMotion="user"> in RootContainer - so we can be playful
  here without hurting anyone who has asked the OS to calm things down.
*/

// The house spring. Snappy with a hint of overshoot so taps and hovers feel
// alive rather than mechanical. Used for interactions.
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

// Tactile feedback for anything clickable - chips, pills, buttons. Spread onto a
// motion element: <motion.button {...tactile}>. Visible on hover (a small lift)
// and on press (a quick squash) so the UI feels physical.
export const tactile = {
  whileHover: { y: -2, scale: 1.03 },
  whileTap: { scale: 0.95 },
  transition: spring,
} as const

// Fade + rise. The standard entrance for a content block or heading.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: springSoft },
}

// Same idea, shorter travel - for an item inside a staggered list so the cascade
// stays tight.
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: spring },
}

// Wrap a group of `fadeUpItem` children in a motion element carrying this
// variant (initial="hidden" animate="show") to make them cascade in one by one.
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}
