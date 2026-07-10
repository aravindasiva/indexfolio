import Link from 'next/link'
import { Tag } from '@/components/Tag/Tag'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { TradedIn } from '@/components/TradedIn/TradedIn'
import { DataTable, type Column } from '@/components/DataTable/DataTable'
import type { TableView } from '@/components/ViewToggle/ViewToggle'
import type { Density } from '@/components/DensityToggle/DensityToggle'
import type { EtfListItem } from '@/lib/api'
import type { SortField } from '../../utils/filters'
import { formatFundSize, formatTer, fundTypeLabel } from '@/lib/etf/format'
import {
  assetClassLabel,
  assetTone,
  DOMICILE_HINT,
  TYPE_HINT,
} from '@/lib/etf/labels'

// Link to the ticker in context (the searched/matched one), encoded so a '#' ticker survives.
const rowHref = (etf: EtfListItem) =>
  `/etf/${encodeURIComponent(etf.matchedTicker)}`

// ETF-specific column config (labels/tones/formatters stay here; DataTable stays domain-free).
function etfColumns(activeCurrency: readonly string[]): Column<EtfListItem>[] {
  return [
    {
      id: 'ticker',
      header: 'Ticker',
      cell: (etf) => (
        <Link
          href={rowHref(etf)}
          onClick={(event) => event.stopPropagation()}
          className="font-semibold transition-colors hover:text-primary"
        >
          {etf.matchedTicker}
        </Link>
      ),
    },
    {
      id: 'name',
      header: 'Name',
      sortField: 'name',
      cell: (etf) => (
        <Tooltip content={etf.name}>
          <span className="block max-w-xs truncate text-muted-foreground">
            {etf.name}
          </span>
        </Tooltip>
      ),
    },
    {
      id: 'asset',
      header: 'Asset',
      showFrom: 'md',
      hideable: true,
      cell: (etf) => (
        <Tag tone={assetTone(etf.assetClass)}>
          {assetClassLabel(etf.assetClass)}
        </Tag>
      ),
    },
    {
      id: 'domicile',
      header: 'Domicile',
      headerHint: DOMICILE_HINT,
      showFrom: 'lg',
      hideable: true,
      cell: (etf) => etf.domicile,
    },
    {
      id: 'tradedIn',
      header: 'Traded in',
      showFrom: 'lg',
      hideable: true,
      cell: (etf) => (
        <TradedIn
          currencies={etf.currencies}
          exchangeCount={etf.exchangeCount}
          active={activeCurrency}
        />
      ),
    },
    {
      id: 'ter',
      header: 'TER',
      sortField: 'ter',
      align: 'end',
      cell: (etf) => formatTer(etf.ter),
    },
    {
      id: 'fundSize',
      header: 'Fund size',
      sortField: 'fundSizeEur',
      align: 'end',
      cell: (etf) => (
        <span className="font-medium">{formatFundSize(etf.fundSizeEur)}</span>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      headerHint: TYPE_HINT,
      cell: (etf) => (
        <Tag tone={etf.isAccumulating ? 'emerald' : 'sky'}>
          {fundTypeLabel(etf.isAccumulating)}
        </Tag>
      ),
    },
  ]
}

// Derived from the column config (any `hideable` column shows up), so the menu can't drift. Id/label
// don't depend on activeCurrency, so we read them off a throwaway instance.
export const HIDEABLE_COLUMNS = etfColumns([])
  .filter((col) => col.hideable)
  .map((col) => ({
    value: col.id,
    label: typeof col.header === 'string' ? col.header : col.id,
  }))

// The card layout (mobile + list view): matched ticker + asset, name, traded-in, TER/size.
function EtfCard({
  etf,
  activeCurrency,
}: {
  etf: EtfListItem
  activeCurrency: readonly string[]
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {etf.matchedTicker}
            </span>
            <Tag tone={assetTone(etf.assetClass)}>
              {assetClassLabel(etf.assetClass)}
            </Tag>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {etf.name}
          </p>
        </div>
        <Tag tone={etf.isAccumulating ? 'emerald' : 'sky'}>
          {fundTypeLabel(etf.isAccumulating)}
        </Tag>
      </div>
      <div className="mt-3">
        <TradedIn
          currencies={etf.currencies}
          exchangeCount={etf.exchangeCount}
          active={activeCurrency}
        />
      </div>
      <div className="mt-3 flex items-center gap-5 text-sm text-muted-foreground">
        <span>
          TER{' '}
          <span className="font-medium tabular-nums text-foreground">
            {formatTer(etf.ter)}
          </span>
        </span>
        <span>
          Size{' '}
          <span className="font-medium tabular-nums text-foreground">
            {formatFundSize(etf.fundSizeEur)}
          </span>
        </span>
      </div>
    </>
  )
}

type Props = {
  etfs: readonly EtfListItem[]
  activeCurrency: readonly string[]
  sort: SortField
  order: 'asc' | 'desc'
  onSort: (field: SortField) => void
  onNavigate: (href: string) => void
  view: TableView
  density: Density
  hiddenColumnIds: readonly string[]
}

export function ResultsTable({
  etfs,
  activeCurrency,
  sort,
  order,
  onSort,
  onNavigate,
  view,
  density,
  hiddenColumnIds,
}: Props) {
  return (
    <DataTable
      rows={etfs}
      columns={etfColumns(activeCurrency)}
      getRowKey={(etf) => etf.id}
      getRowHref={rowHref}
      onNavigate={onNavigate}
      sort={sort}
      order={order}
      onSort={(field) => onSort(field as SortField)}
      view={view}
      density={density}
      hiddenColumnIds={hiddenColumnIds}
      renderCard={(etf) => (
        <EtfCard etf={etf} activeCurrency={activeCurrency} />
      )}
    />
  )
}
