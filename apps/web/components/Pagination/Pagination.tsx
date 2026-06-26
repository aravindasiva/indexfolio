import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { tactile } from '@/lib/motion'
import { cn } from '@/lib/utils'

// Prev/next pagination. Renders nothing when there is only one page.
export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <PageButton
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </PageButton>
      <span className="text-sm text-muted-foreground tabular-nums">
        Page {page} of {totalPages}
      </span>
      <PageButton
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        label="Next page"
      >
        <ChevronRight className="size-4" />
      </PageButton>
    </div>
  )
}

function PageButton({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled: boolean
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      // Only the enabled button reacts to hover/press.
      {...(disabled ? {} : tactile)}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md border border-border transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-40'
          : 'text-foreground hover:bg-muted hover:border-primary/40',
      )}
    >
      {children}
    </motion.button>
  )
}
