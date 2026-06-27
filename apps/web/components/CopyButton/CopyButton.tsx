'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { tactile } from '@/lib/motion'
import { cn } from '@/lib/utils'

// size 'sm' fits inside a text-xs chip (matches tag height); 'md' is a standalone
// affordance.
const SIZES = {
  sm: { button: 'size-4', icon: 'size-3' },
  md: { button: 'size-6', icon: 'size-3.5' },
}

// A small icon button that copies a value to the clipboard and flips to a check
// for a moment. The tooltip confirms the action ("Copied!"). No-ops where the
// Clipboard API is unavailable.
export function CopyButton({
  value,
  label,
  size = 'md',
}: {
  value: string
  label?: string
  size?: 'sm' | 'md'
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await globalThis.navigator?.clipboard?.writeText(value)
      setCopied(true)
      globalThis.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked or unavailable; leave the value for manual copy.
    }
  }

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
      <motion.button
        type="button"
        onClick={copy}
        aria-label={label ?? `Copy ${value}`}
        {...tactile}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
          SIZES[size].button,
        )}
      >
        {copied ? (
          <Check className={cn(SIZES[size].icon, 'text-emerald-500')} />
        ) : (
          <Copy className={SIZES[size].icon} />
        )}
      </motion.button>
    </Tooltip>
  )
}
