import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { spring } from '@/lib/motion'
import { Surface } from '@/components/Surface/Surface'
import { Tag } from '@/components/Tag/Tag'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { cn } from '@/lib/utils'
import type { Etf } from '@/lib/api'
import type { ScreenerFilters, SortField } from '../../utils/filters'
import { formatFundSize, formatTer, fundTypeLabel } from '@/lib/etf/format'
import {
  assetClassLabel,
  assetTone,
  DOMICILE_HINT,
  TYPE_HINT,
} from '@/lib/etf/labels'

type SortControls = {
  sort: ScreenerFilters['sort']
  order: ScreenerFilters['order']
  onSort: (field: SortField) => void
}

type Props = SortControls & {
  etfs: readonly Etf[]
}

const HEAD =
  'h-11 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase'
const CELL = 'px-4 py-3.5'

// Results table. One responsive table everywhere (fewer columns on small
// screens, never a different layout). Sortable headers write to the URL; the
// whole row links to the (deferred) ETF detail page.
export function ResultsTable({ etfs, sort, order, onSort }: Props) {
  const router = useRouter()
  const sortProps = { sort, order, onSort }

  return (
    <Surface className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted/30 hover:bg-transparent">
            <SortHeader field="ticker" label="Ticker" {...sortProps} />
            <SortHeader field="name" label="Name" {...sortProps} />
            <TableHead className={cn(HEAD, 'hidden md:table-cell')}>
              Asset
            </TableHead>
            <TableHead className={cn(HEAD, 'hidden lg:table-cell')}>
              <HeaderHint label="Domicile" hint={DOMICILE_HINT} />
            </TableHead>
            <TableHead className={cn(HEAD, 'hidden lg:table-cell')}>
              Exchange
            </TableHead>
            <SortHeader field="ter" label="TER" align="right" {...sortProps} />
            <SortHeader
              field="fundSizeEur"
              label="Fund size"
              align="right"
              {...sortProps}
            />
            <TableHead className={HEAD}>
              <HeaderHint label="Type" hint={TYPE_HINT} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {etfs.map((etf, index) => (
            <motion.tr
              key={etf.id}
              data-slot="table-row"
              onClick={() => router.push(`/etf/${etf.ticker}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // A capped per-row delay makes the list cascade in on load and on
              // every page/filter change, without long lists dragging on.
              transition={{ ...spring, delay: Math.min(index * 0.035, 0.5) }}
              className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-primary/5"
            >
              <TableCell className={cn(CELL, 'font-semibold')}>
                <Link
                  href={`/etf/${etf.ticker}`}
                  onClick={(event) => event.stopPropagation()}
                  className="transition-colors hover:text-primary"
                >
                  {etf.ticker}
                </Link>
              </TableCell>
              <TableCell className={cn(CELL, 'max-w-xs text-muted-foreground')}>
                {/* Names are truncated to keep columns aligned; the tooltip
                    surfaces the full name on hover (the row's ticker link leads
                    to the detail page where the full name is always shown). */}
                <Tooltip content={etf.name}>
                  <span className="block truncate">{etf.name}</span>
                </Tooltip>
              </TableCell>
              <TableCell className={cn(CELL, 'hidden md:table-cell')}>
                <Tag tone={assetTone(etf.assetClass)}>
                  {assetClassLabel(etf.assetClass)}
                </Tag>
              </TableCell>
              <TableCell className={cn(CELL, 'hidden lg:table-cell')}>
                {etf.domicile}
              </TableCell>
              <TableCell className={cn(CELL, 'hidden lg:table-cell')}>
                {etf.exchange}
              </TableCell>
              <TableCell className={cn(CELL, 'text-right tabular-nums')}>
                {formatTer(etf.ter)}
              </TableCell>
              <TableCell
                className={cn(CELL, 'text-right font-medium tabular-nums')}
              >
                {formatFundSize(etf.fundSizeEur)}
              </TableCell>
              <TableCell className={CELL}>
                <Tag tone={etf.isAccumulating ? 'emerald' : 'sky'}>
                  {fundTypeLabel(etf.isAccumulating)}
                </Tag>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </Surface>
  )
}

function SortHeader({
  field,
  label,
  sort,
  order,
  onSort,
  align,
}: SortControls & { field: SortField; label: string; align?: 'right' }) {
  const active = sort === field
  return (
    <TableHead className={cn(HEAD, align === 'right' && 'text-right')}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          'inline-flex items-center gap-1 uppercase transition-colors hover:text-foreground',
          active && 'text-foreground',
          align === 'right' && 'flex-row-reverse',
        )}
      >
        {label}
        <ArrowUp
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

function HeaderHint({ label, hint }: { label: string; hint: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <Tooltip content={hint}>
        <button
          type="button"
          aria-label={`${label} info`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info className="size-3.5" />
        </button>
      </Tooltip>
    </span>
  )
}
