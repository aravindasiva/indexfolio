'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/Error/ErrorPage'

// Next's error boundary: log the error, then render the styled ErrorPage
type ErrorBoundaryProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <ErrorPage reset={reset} />
}
