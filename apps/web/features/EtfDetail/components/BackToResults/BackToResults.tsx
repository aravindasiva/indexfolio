'use client'

import { BackButton } from '@/components/BackButton/BackButton'
import { getScreenerReturn } from '@/features/Screener/utils/returnUrl'

/*
  Returns to the exact screener results (filters + page) the visitor came from,
  remembered in sessionStorage. A client island so it can read that on click and
  so the resolver never has to cross the server boundary.
*/
export function BackToResults() {
  return <BackButton to={getScreenerReturn} label="Back to results" />
}
