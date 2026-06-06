'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'

const ThemeToggle = dynamic(
  () => import('./_components/ThemeToggle').then((m) => m.ThemeToggle),
  {
    ssr: false,
    loading: () => <div aria-hidden="true" className="size-8" />,
  },
)

const NAV_LINKS = [
  { label: 'Screener', href: '/screener' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'Overlap', href: '/overlap' },
  { label: 'Tax guides', href: '/tax/portugal' },
] as const

export function Nav() {
  return (
    <motion.header
      className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2"
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.1 }}
    >
      <nav
        aria-label="Main navigation"
        className="glass-surface relative flex items-center justify-between gap-4 overflow-hidden rounded-full px-5 py-2.5"
      >
        {/* Gloss sheen - clipped to pill shape by overflow-hidden on the nav */}
        <div
          aria-hidden="true"
          className="glass-gloss pointer-events-none absolute inset-x-0 top-0 h-1/2"
        />

        <Link
          href="/"
          aria-label="Indexfolio home"
          className="relative shrink-0 font-display text-[0.9375rem] font-bold tracking-tight text-foreground no-underline"
        >
          Indexfolio
        </Link>

        <ul className="relative hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="glass-chip-link block rounded-full px-3.5 py-1.5 text-sm font-medium opacity-90 hover:opacity-100"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="relative">
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  )
}
