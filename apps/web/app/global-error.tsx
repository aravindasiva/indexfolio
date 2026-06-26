'use client'

import {
  GlobalError,
  type GlobalErrorProps,
} from '@/components/Error/GlobalError'

export default function GlobalErrorBoundary(props: GlobalErrorProps) {
  return <GlobalError {...props} />
}
