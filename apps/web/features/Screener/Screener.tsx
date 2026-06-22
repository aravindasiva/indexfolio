'use client'

import { useQuery } from '@tanstack/react-query'
import { getEtfList, type EtfListParams } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { ResultsTable } from './components/ResultsTable/ResultsTable'

// The default view. PR2 replaces this with URL-derived filters.
const DEFAULT_PARAMS: EtfListParams = {
  page: 1,
  limit: 20,
  sort: 'ter',
  order: 'asc',
}

/*
  Fetches the ETF list on the client and renders it. Plain useQuery over the
  api.ts function - the request is a normal GET you can see in the network tab.
*/
export function Screener() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['etfs', DEFAULT_PARAMS],
    queryFn: () => getEtfList(DEFAULT_PARAMS),
  })

  if (isPending) {
    return (
      <div className="space-y-2" aria-busy="true">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-border p-8 text-center">
        <p className="text-muted-foreground">
          Could not load ETFs. The API may be unreachable.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (data.data.length === 0) {
    return (
      <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
        No ETFs found.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {data.meta.total} {data.meta.total === 1 ? 'ETF' : 'ETFs'}
      </p>
      <ResultsTable etfs={data.data} />
    </div>
  )
}
