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

const SHOW_FROM: Record<'md' | 'lg', string> = {
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
}
const showClass = (showFrom?: 'md' | 'lg') =>
  showFrom ? SHOW_FROM[showFrom] : ''

function ariaSort(
  active: boolean,
  order?: 'asc' | 'desc',
): 'none' | 'ascending' | 'descending' {
  if (!active) return 'none'
  return order === 'desc' ? 'descending' : 'ascending'
}

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

  const cardItems = rows.map((row) => {
    const href = getRowHref?.(row)
    const body = renderCard ? (
      renderCard(row)
    ) : (
      <AutoCard columns={visible} row={row} />
    )
    const surface = (
      <Surface className="h-full p-4 transition-colors hover:border-primary/40">
        {body}
      </Surface>
    )
    return href ? (
      <Link
        key={getRowKey(row)}
        href={href}
        className="block min-w-0 no-underline"
      >
        {surface}
      </Link>
    ) : (
      <div key={getRowKey(row)} className="min-w-0">
        {surface}
      </div>
    )
  })

  // Card view fills a responsive grid on wider screens; the below-md table fallback stays a stack.
  if (view === 'cards') {
    return (
      <div
        className={cn(
          'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3',
          className,
        )}
      >
        {cardItems}
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-3 md:hidden">{cardItems}</div>
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
  const base = cn(
    HEAD,
    showClass(col.showFrom),
    col.align === 'end' && 'text-right',
  )

  if (col.sortField && onSort) {
    return (
      <SortableHeader
        col={col}
        base={base}
        field={col.sortField}
        active={sort === col.sortField}
        order={order}
        onSort={onSort}
      />
    )
  }
  if (col.headerHint) return <HintHeader col={col} base={base} />
  return <TableHead className={base}>{col.header}</TableHead>
}

// Sort state reaches screen readers via aria-sort + a named button; the arrow is decorative.
function SortableHeader<Row>({
  col,
  base,
  field,
  active,
  order,
  onSort,
}: {
  col: Column<Row>
  base: string
  field: string
  active: boolean
  order?: 'asc' | 'desc'
  onSort: (field: string) => void
}) {
  const label = typeof col.header === 'string' ? col.header : undefined
  return (
    <TableHead aria-sort={ariaSort(active, order)} className={base}>
      <button
        type="button"
        onClick={() => onSort(field)}
        aria-label={label ? `Sort by ${label}` : undefined}
        className={cn(
          'inline-flex items-center gap-1 uppercase transition-colors hover:text-foreground',
          active && 'text-foreground',
          col.align === 'end' && 'flex-row-reverse',
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

function HintHeader<Row>({ col, base }: { col: Column<Row>; base: string }) {
  const label = typeof col.header === 'string' ? col.header : undefined
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
