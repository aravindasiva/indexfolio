import { AmbientBackground } from '@/components/AmbientBackground/AmbientBackground'
import { Skeleton } from '@/components/ui/skeleton'

// Generic route loading skeleton, shown during navigation. Mirrors the
// content-page layout so the swap to the real page is minimal.
export default function Loading() {
  return (
    <>
      <AmbientBackground />
      <main className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-4" aria-busy="true" aria-label="Loading">
          <Skeleton className="h-10 w-64 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
          <div className="mt-8 space-y-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
