'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="glass-chip-hover flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-150 hover:scale-[1.03] hover:text-foreground focus-visible:outline-none"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
