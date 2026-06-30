import type { ReactNode } from 'react'
import { AmbientBackground } from '@/components/AmbientBackground/AmbientBackground'

interface PageContainerProps {
  title?: string
  subtitle?: string
  breadcrumbs?: ReactNode
  children: ReactNode
}

/*
  Standard content page wrapper (gutter, padding that clears the fixed nav,
  optional breadcrumbs and title/subtitle header). Use for every route except the
  full-viewport landing page, so app/ route files stay trivial.
*/
export function PageContainer({
  title,
  subtitle,
  breadcrumbs,
  children,
}: Readonly<PageContainerProps>) {
  return (
    <>
      {/* Dot-grid backdrop (content pages only; landing has its own). */}
      <AmbientBackground />
      <main className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        {breadcrumbs && <div className="mb-6">{breadcrumbs}</div>}
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
