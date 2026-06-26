'use client'

import { ErrorPage, type ErrorPageProps } from '@/components/Error/ErrorPage'

export default function ErrorBoundary(props: ErrorPageProps) {
  return <ErrorPage {...props} />
}
