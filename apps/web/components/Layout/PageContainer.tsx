interface PageContainerProps {
  children: React.ReactNode
}

/**
 * Standard content page wrapper. Provides horizontal padding and a max-width
 * gutter. Use this for every route except the full-viewport landing page.
 */
export function PageContainer({ children }: Readonly<PageContainerProps>) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      {children}
    </main>
  )
}
