'use client'

import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'framer-motion'
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
            {/* One place to honour prefers-reduced-motion for every framer
                animation in the app - so we can be playful by default and still
                calm down instantly for users who ask the OS to. */}
            <MotionConfig reducedMotion="user">
              <Nav />
              {children}
              <Disclaimer />
            </MotionConfig>
          </TooltipProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
