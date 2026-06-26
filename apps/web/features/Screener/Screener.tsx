'use client'

import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { springSoft } from '@/lib/motion'
import { getEtfFilters, getEtfs } from '@/lib/api'
import { Surface } from '@/components/Surface/Surface'
import { Pagination } from '@/components/Pagination/Pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { FilterBar } from './components/FilterBar/FilterBar'
import { ResultsTable } from './components/ResultsTable/ResultsTable'
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
  const [filters, setFilters] = useScreenerFilters()
  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const params = filtersToParams({ ...filters, search: debouncedSearch })

  const filterOptions = useQuery({
    queryKey: ['etf-filters'],
    queryFn: getEtfFilters,
    staleTime: 5 * 60 * 1000,
  })
  const list = useQuery({
    queryKey: ['etfs', params],
    queryFn: () => getEtfs(params),
  })

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
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {list.data.meta.total}
          </span>{' '}
          {list.data.meta.total === 1 ? 'ETF' : 'ETFs'}
        </p>
        <ResultsTable
          etfs={list.data.data}
          sort={filters.sort}
          order={filters.order}
          onSort={onSort}
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
