import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { tactile } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { paginationRange } from './utils/paginationRange'

// Numbered pagination: « first, ‹ prev, page numbers (with gaps), › next, » last.
// Renders nothing when there is only one page.
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
    <nav
      aria-label="Pagination"
      className="flex items-center justify-end gap-1 pt-2"
    >
      <Arrow
        icon={ChevronsLeft}
        label="First page"
        disabled={page <= 1}
        onClick={() => onPage(1)}
      />
      <Arrow
        icon={ChevronLeft}
        label="Previous page"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      />

      {paginationRange(page, totalPages).map((item) =>
        typeof item === 'number' ? (
          <PageButton
            key={item}
            page={item}
            active={item === page}
            onClick={() => onPage(item)}
          />
        ) : (
          <span
            key={item}
            className="px-1 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ),
      )}

      <Arrow
        icon={ChevronRight}
        label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
      />
      <Arrow
        icon={ChevronsRight}
        label="Last page"
        disabled={page >= totalPages}
        onClick={() => onPage(totalPages)}
      />
    </nav>
  )
}

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      {...(active ? {} : tactile)}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium tabular-nums transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'border border-border text-foreground hover:bg-muted hover:border-primary/40',
      )}
    >
      {page}
    </motion.button>
  )
}

function Arrow({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      {...(disabled ? {} : tactile)}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-md border border-border transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-40'
          : 'text-foreground hover:bg-muted hover:border-primary/40',
      )}
    >
      <Icon className="size-4" />
    </motion.button>
  )
}
