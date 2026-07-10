import type { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUp, Info } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Surface } from '@/components/Surface/Surface'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { TableView } from '@/components/ViewToggle/ViewToggle'
import type { Density } from '@/components/DensityToggle/DensityToggle'

export type Column<Row> = {
  id: string
  header: ReactNode
  cell: (row: Row) => ReactNode
  align?: 'start' | 'end'
  sortField?: string
  headerHint?: ReactNode
  showFrom?: 'md' | 'lg'
  // Whether a columns menu may hide this column; the toolbar owner derives its menu from these.
  hideable?: boolean
}

export type DataTableProps<Row> = {
  rows: readonly Row[]
  columns: readonly Column<Row>[]
  getRowKey: (row: Row) => string
  getRowHref?: (row: Row) => string
  // Table-row click; the consumer wires it to its router. Cards navigate via getRowHref.
  onNavigate?: (href: string) => void
  sort?: string
  order?: 'asc' | 'desc'
  onSort?: (field: string) => void
  view?: TableView
  density?: Density
  hiddenColumnIds?: readonly string[]
  renderCard?: (row: Row) => ReactNode
  className?: string
}

const HEAD =
  'h-11 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase'

const showClass = (showFrom?: 'md' | 'lg') =>
  showFrom === 'md'
    ? 'hidden md:table-cell'
    : showFrom === 'lg'
      ? 'hidden lg:table-cell'
      : ''

// Sortable table that falls back to cards below md (or when view="cards"). Columns are render-prop
// config, so it stays domain-free - consumers supply the cells and an optional renderCard.
export function DataTable<Row>({
  rows,
  columns,
  getRowKey,
  getRowHref,
  onNavigate,
  sort,
  order,
  onSort,
  view = 'table',
  density = 'comfortable',
  hiddenColumnIds = [],
  renderCard,
  className,
}: DataTableProps<Row>) {
  const cellPad = density === 'compact' ? 'px-3 py-2.5' : 'px-4 py-3.5'
  const visible = columns.filter((col) => !hiddenColumnIds.includes(col.id))

  const cards = (
    <div className="space-y-3">
      {rows.map((row) => {
        const href = getRowHref?.(row)
        const body = renderCard ? (
          renderCard(row)
        ) : (
          <AutoCard columns={visible} row={row} />
        )
        const surface = (
          <Surface className="p-4 transition-colors hover:border-primary/40">
            {body}
          </Surface>
        )
        return href ? (
          <Link key={getRowKey(row)} href={href} className="block no-underline">
            {surface}
          </Link>
        ) : (
          <div key={getRowKey(row)}>{surface}</div>
        )
      })}
    </div>
  )

  if (view === 'cards') return <div className={className}>{cards}</div>

  return (
    <div className={className}>
      <div className="md:hidden">{cards}</div>
      <Surface className="hidden overflow-hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/30 hover:bg-transparent">
              {visible.map((col) => (
                <HeaderCell
                  key={col.id}
                  col={col}
                  sort={sort}
                  order={order}
                  onSort={onSort}
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => {
              const href = getRowHref?.(row)
              const navigate =
                href && onNavigate ? () => onNavigate(href) : undefined
              return (
                // Cap the stagger so long lists don't drag in.
                <motion.tr
                  key={getRowKey(row)}
                  data-slot="table-row"
                  onClick={navigate}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...spring,
                    delay: Math.min(index * 0.035, 0.5),
                  }}
                  className={cn(
                    'border-b border-border transition-colors last:border-0',
                    navigate && 'cursor-pointer hover:bg-primary/5',
                  )}
                >
                  {visible.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn(
                        cellPad,
                        showClass(col.showFrom),
                        col.align === 'end' && 'text-right tabular-nums',
                      )}
                    >
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
      </Surface>
    </div>
  )
}

function HeaderCell<Row>({
  col,
  sort,
  order,
  onSort,
}: {
  col: Column<Row>
  sort?: string
  order?: 'asc' | 'desc'
  onSort?: (field: string) => void
}) {
  const alignR = col.align === 'end'
  const base = cn(HEAD, showClass(col.showFrom), alignR && 'text-right')

  // Screen readers get sort state from aria-sort + a named button; the arrow is decorative.
  const label = typeof col.header === 'string' ? col.header : undefined

  if (col.sortField && onSort) {
    const field = col.sortField
    const active = sort === field
    return (
      <TableHead
        aria-sort={
          active ? (order === 'desc' ? 'descending' : 'ascending') : 'none'
        }
        className={base}
      >
        <button
          type="button"
          onClick={() => onSort(field)}
          aria-label={label ? `Sort by ${label}` : undefined}
          className={cn(
            'inline-flex items-center gap-1 uppercase transition-colors hover:text-foreground',
            active && 'text-foreground',
            alignR && 'flex-row-reverse',
          )}
        >
          {col.header}
          <ArrowUp
            aria-hidden
            className={cn(
              'size-3.5 transition-all',
              active ? 'opacity-100' : 'opacity-0',
              order === 'desc' && 'rotate-180',
            )}
          />
        </button>
      </TableHead>
    )
  }

  if (col.headerHint) {
    return (
      <TableHead className={base}>
        <span className="inline-flex items-center gap-1">
          {col.header}
          <Tooltip content={col.headerHint}>
            <button
              type="button"
              aria-label={label ? `About ${label}` : 'More info'}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Info aria-hidden className="size-3.5" />
            </button>
          </Tooltip>
        </span>
      </TableHead>
    )
  }

  return <TableHead className={base}>{col.header}</TableHead>
}

// Fallback card when a consumer gives no renderCard: stacked header/value pairs.
function AutoCard<Row>({
  columns,
  row,
}: {
  columns: readonly Column<Row>[]
  row: Row
}) {
  return (
    <dl className="space-y-2">
      {columns.map((col) => (
        <div
          key={col.id}
          className="flex items-center justify-between gap-3 text-sm"
        >
          <dt className="text-muted-foreground">{col.header}</dt>
          <dd className="text-foreground">{col.cell(row)}</dd>
        </div>
      ))}
    </dl>
  )
}
