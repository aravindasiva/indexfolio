'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { springSoft } from '@/lib/motion'
import { getEtfFilters, getEtfs } from '@/lib/api'
import { Surface } from '@/components/Surface/Surface'
import { Pagination } from '@/components/Pagination/Pagination'
import { FilterSelect } from '@/components/FilterSelect/FilterSelect'
import { ViewToggle } from '@/components/ViewToggle/ViewToggle'
import { DensityToggle } from '@/components/DensityToggle/DensityToggle'
import { CatTap } from '@/components/CatTap/CatTap'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useTablePrefs } from '@/hooks/useTablePrefs'
import { FilterBar } from './components/FilterBar/FilterBar'
import {
  HIDEABLE_COLUMNS,
  ResultsTable,
} from './components/ResultsTable/ResultsTable'
import { rememberScreenerReturn } from './utils/returnUrl'
import {
  filtersToParams,
  hasActiveFilters,
  useScreenerFilters,
  type SortField,
} from './utils/filters'

/*
  Screener orchestrator. Filters live in the URL (nuqs); the list is fetched
  client-side via react-query, keyed on those filters. Search is debounced so
  typing does not fire a request per keystroke.
*/
export function Screener() {
  const router = useRouter()
  const [filters, setFilters] = useScreenerFilters()
  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const params = filtersToParams({ ...filters, search: debouncedSearch })

  const { prefs, setView, setDensity, setHiddenColumns } =
    useTablePrefs('screener')

  // The Columns menu works in "visible" terms; we store the inverse (hidden ids).
  const visibleColumns = HIDEABLE_COLUMNS.filter(
    (col) => !prefs.hiddenColumns.includes(col.value),
  ).map((col) => col.value)
  const onColumnsChange = (visible: string[]) =>
    setHiddenColumns(
      HIDEABLE_COLUMNS.filter((col) => !visible.includes(col.value)).map(
        (col) => col.value,
      ),
    )

  const filterOptions = useQuery({
    queryKey: ['etf-filters'],
    queryFn: getEtfFilters,
    staleTime: 5 * 60 * 1000,
  })
  const list = useQuery({
    queryKey: ['etfs', params],
    queryFn: () => getEtfs(params),
  })

  // Remember the current filtered URL so an ETF detail page can return here.
  useEffect(() => {
    rememberScreenerReturn(
      globalThis.location.pathname + globalThis.location.search,
    )
  }, [filters])

  // Click a column header: toggle order if already sorted by it, else sort by it.
  const onSort = (field: SortField) => {
    setFilters({
      sort: field,
      order: filters.sort === field && filters.order === 'asc' ? 'desc' : 'asc',
      page: 1,
    })
  }

  // Pick the result state with early returns (no nested ternaries).
  function renderResults() {
    if (list.isPending) return <ResultsSkeleton />
    if (list.isError) {
      return <ErrorState onRetry={() => list.refetch()} />
    }
    if (list.data.data.length === 0) {
      return (
        <EmptyState
          filtered={hasActiveFilters(filters)}
          onClear={() => setFilters(null)}
        />
      )
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSoft}
        className="space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <CatTap className="font-medium text-foreground">
              {list.data.meta.total}
            </CatTap>{' '}
            {list.data.meta.total === 1 ? 'ETF' : 'ETFs'}
          </p>
          {/* Table-only controls: hidden on mobile (always cards) and in card view. */}
          <div className="hidden items-center gap-2 md:flex">
            {prefs.view === 'table' && (
              <>
                <FilterSelect
                  mode="multi"
                  label="Columns"
                  searchable={false}
                  options={HIDEABLE_COLUMNS}
                  value={visibleColumns}
                  onChange={onColumnsChange}
                />
                <DensityToggle value={prefs.density} onChange={setDensity} />
              </>
            )}
            <ViewToggle value={prefs.view} onChange={setView} />
          </div>
        </div>
        <ResultsTable
          etfs={list.data.data}
          activeCurrency={filters.currency}
          sort={filters.sort}
          order={filters.order}
          onSort={onSort}
          onNavigate={(href) => router.push(href)}
          view={prefs.view}
          density={prefs.density}
          hiddenColumnIds={prefs.hiddenColumns}
        />
        <Pagination
          page={list.data.meta.page}
          totalPages={list.data.meta.totalPages}
          onPage={(page) => setFilters({ page })}
        />
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        options={filterOptions.data}
      />
      {renderResults()}
    </div>
  )
}

function ResultsSkeleton() {
  return (
    <Surface className="space-y-3 p-5" aria-busy="true">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </Surface>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Surface className="p-12 text-center">
      <p className="text-muted-foreground">
        Could not load ETFs. The API may be unreachable.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 text-sm font-medium text-primary hover:underline"
      >
        Try again
      </button>
    </Surface>
  )
}

function EmptyState({
  filtered,
  onClear,
}: {
  filtered: boolean
  onClear: () => void
}) {
  if (filtered) {
    return (
      <Surface className="p-12 text-center">
        <p className="text-muted-foreground">No ETFs match your filters.</p>
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Clear filters
        </button>
      </Surface>
    )
  }
  return (
    <Surface className="p-12 text-center text-muted-foreground">
      Data is syncing. Check back soon.
    </Surface>
  )
}
