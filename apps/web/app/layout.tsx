import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Nav } from '@/components/Nav/Nav'
import { Disclaimer } from '@/components/Disclaimer/Disclaimer'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Indexfolio',
  description: 'Free toolkit for EU passive investors',
}

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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <Nav />
            {children}
            <Disclaimer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
