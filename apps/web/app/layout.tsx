import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { RootContainer } from '@/containers/RootContainer/RootContainer'
import { rootMetadata } from '@/lib/seo/metadata'
import './globals.css'

// Variable fonts: omitting `weight` ships one file per family instead of one per
// weight, avoiding next/font's "preloaded but not used" warning from unused woff2s.
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
