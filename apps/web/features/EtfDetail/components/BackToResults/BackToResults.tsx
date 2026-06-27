'use client'

import { BackButton } from '@/components/BackButton/BackButton'
import { getScreenerReturn } from '@/features/Screener/utils/returnUrl'

/*
  Returns to the exact screener results (filters + page) the visitor arrived
  from, remembered in sessionStorage. A client island so it can read that value
  on click - and so the resolver function never crosses the server boundary,
  which a Server Component can't do.
*/
export function BackToResults() {
  return <BackButton to={getScreenerReturn} label="Back to results" />
}
