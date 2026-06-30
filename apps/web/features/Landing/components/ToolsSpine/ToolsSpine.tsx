'use client'

import { useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { nodes as graphNodes } from '@indexfolio/knowledge-graph'
import { springSoft } from '@/lib/motion'

/*
  The tools presented as nodes on a glowing vertical "spine" that extends the
  knowledge graph's edges down the page. The line fills as you scroll and each
  node lights up when the fill reaches it - so the section reads as travelling
  through the graph rather than a generic card grid. Lives on the same continuous
  background as the hero (no section cutoff).
*/
type Tool = { index: string; label: string; href: string; description: string }

// Derived from the knowledge graph so the spine, the nav, and the graph stay in
// lockstep. The index is the tool's position, so it can never drift either.
const TOOLS: Tool[] = graphNodes
  .filter((node) => node.type === 'tool')
  .map((node, index) => ({
    index: String(index + 1).padStart(2, '0'),
    label: node.label,
    href: node.href,
    description: node.description ?? '',
  }))

export function ToolsSpine() {
  const sectionRef = useRef<HTMLElement>(null)
  // Track the whole section and complete at 'end end' (reached at max scroll),
  // so the spine fills fully by the time you reach the bottom of the page.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'end end'],
  })
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  })

  return (
    <section ref={sectionRef} className="relative px-6 pb-32 pt-24 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={springSoft}
          className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          Everything connects.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ ...springSoft, delay: 0.08 }}
          className="mt-4 max-w-md text-base text-muted-foreground"
        >
          The graph is the map. Follow the thread to every tool.
        </motion.p>

        <div className="relative mt-16">
          {/* Spine: faint track + a fill that grows as you scroll */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-1.75 top-2 w-px bg-foreground/12"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: fill }}
            className="absolute bottom-2 left-1.75 top-2 w-px origin-top bg-primary"
          />

          <ul className="space-y-14">
            {TOOLS.map((tool, index) => (
              <li key={tool.href}>
                <ToolEntry
                  tool={tool}
                  fill={fill}
                  fraction={(index + 0.5) / TOOLS.length}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ToolEntry({
  tool,
  fill,
  fraction,
}: {
  tool: Tool
  fill: MotionValue<number>
  fraction: number
}) {
  // The node lights up as the scroll fill reaches its point on the spine.
  const nodeOpacity = useTransform(fill, [fraction - 0.08, fraction], [0.35, 1])
  const nodeScale = useTransform(fill, [fraction - 0.08, fraction], [0.85, 1])

  return (
    // Entry slides toward the reader on hover - a physical "this is a link" cue
    // beyond the colour change.
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={springSoft}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.99 }}
    >
      <Link
        href={tool.href}
        className="group relative block pl-12 no-underline"
      >
        <motion.span
          aria-hidden="true"
          style={{ opacity: nodeOpacity, scale: nodeScale }}
          className="absolute left-1.75 top-2.5 size-3.5 -translate-x-1/2 rounded-full bg-primary ring-4 ring-primary/15 transition-shadow duration-300 group-hover:ring-primary/30"
        />
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold text-foreground transition-colors duration-200 group-hover:text-primary sm:text-3xl">
            {tool.label}
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            {tool.index}
          </span>
        </div>
        <p className="mt-2 max-w-md text-muted-foreground">
          {tool.description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          Open
          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </Link>
    </motion.div>
  )
}
