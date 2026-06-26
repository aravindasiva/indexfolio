import type { ReactNode } from 'react'
import { AmbientBackground } from '@/components/AmbientBackground/AmbientBackground'

interface PageContainerProps {
  title?: string
  subtitle?: string
  children: ReactNode
}

/*
  Standard content page wrapper: max-width gutter, padding that clears the fixed
  nav, and an optional title/subtitle header. Use for every route except the
  full-viewport landing page. Lets app/ route files stay trivial.
*/
export function PageContainer({
  title,
  subtitle,
  children,
}: Readonly<PageContainerProps>) {
  return (
    <>
      {/* Blueprint dot-grid backdrop, behind every content page (the landing
          keeps its own 3D starfield). */}
      <AmbientBackground />
      <main className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <header className="mb-8">
            {title && (
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </main>
    </>
  )
}
