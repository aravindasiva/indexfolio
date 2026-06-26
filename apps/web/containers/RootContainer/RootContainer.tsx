'use client'

import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'framer-motion'
import { Analytics } from '@vercel/analytics/next'
import { Nav } from '@/components/Nav/Nav'
import { Disclaimer } from '@/components/Disclaimer/Disclaimer'
import { TooltipProvider } from '@/components/ui/tooltip'

/*
  The app shell: every client provider (TanStack Query, nuqs, theme, tooltip)
  plus the persistent chrome (Nav, Disclaimer) that wraps every page. Keeps the
  root layout thin - it only owns <html>/<body>, fonts, and metadata.
*/
export function RootContainer({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000 } },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            {/* Honour prefers-reduced-motion for all framer animations. */}
            <MotionConfig reducedMotion="user">
              <Nav />
              {children}
              <Disclaimer />
            </MotionConfig>
            {/* Cookieless, GDPR-friendly page analytics (no consent banner). */}
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
