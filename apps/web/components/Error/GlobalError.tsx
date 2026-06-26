'use client'

import { useEffect } from 'react'
import { COLORS } from '@/lib/colors'

export type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

// Last-resort UI when the root layout itself errors. It replaces the layout, so
// there are no providers/fonts/CSS - everything is inline. Production only.
export function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: COLORS.background,
          color: COLORS.foreground,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 12px' }}>
            Something went wrong
          </h1>
          <p
            style={{ color: COLORS.muted, margin: '0 0 24px', lineHeight: 1.5 }}
          >
            The app hit an unexpected error. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              cursor: 'pointer',
              border: 'none',
              borderRadius: 999,
              backgroundColor: COLORS.primary,
              color: '#ffffff',
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
