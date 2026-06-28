import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { RootContainer } from '@/containers/RootContainer/RootContainer'
import { rootMetadata } from '@/lib/seo/metadata'
import './globals.css'

// Both are variable fonts: omitting `weight` ships one variable file per family
// (covering every weight we use) instead of a static file per weight. That stops
// next/font preloading a pile of per-weight woff2s that never paint - the cause
// of the "preloaded but not used" console warning.
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = rootMetadata

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <RootContainer>{children}</RootContainer>
      </body>
    </html>
  )
}
