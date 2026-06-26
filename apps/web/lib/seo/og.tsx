import { ImageResponse } from 'next/og'
import { COLORS } from '../colors'

// Satori (next/og): inline styles + flexbox only, no Tailwind.
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

type OgContent = { eyebrow?: string; title: string; subtitle?: string }

// The indexfolio mark (same paths as components/icons/Logo). Used both as the
// small wordmark glyph and, rendered large, as the hero graphic - so the hero
// IS the logo, not a decorative stand-in.
function LogoMark({ size, opacity = 1 }: { size: number; opacity?: number }) {
  const c = COLORS.primary
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      style={{ opacity }}
    >
      <path
        d="M36.505 27.547L65.675 37.467L67.285 32.733L38.115 22.813L36.505 27.547Z"
        fill={c}
        fillOpacity="0.52"
      />
      <path
        d="M29.613 33.407L51.153 68.897L55.427 66.303L33.887 30.813L29.613 33.407Z"
        fill={c}
        fillOpacity="0.46"
      />
      <path
        d="M69.2669 45.382L60.8669 65.872L65.4929 67.768L73.8929 47.278L69.2669 45.382Z"
        fill={c}
        fillOpacity="0.4"
      />
      <path
        d="M18.162 63.727L24.652 34.237L19.768 33.163L13.278 62.653L18.162 63.727Z"
        fill={c}
        fillOpacity="0.32"
      />
      <path
        d="M21.6 74.538L47.77 78.028L48.43 73.072L22.26 69.582L21.6 74.538Z"
        fill={c}
        fillOpacity="0.3"
      />
      <path
        d="M25 34C32.1797 34 38 28.1797 38 21C38 13.8203 32.1797 8 25 8C17.8203 8 12 13.8203 12 21C12 28.1797 17.8203 34 25 34Z"
        fill={c}
      />
      <path
        d="M75 47C79.9706 47 84 42.9706 84 38C84 33.0294 79.9706 29 75 29C70.0294 29 66 33.0294 66 38C66 42.9706 70.0294 47 75 47Z"
        fill={c}
        fillOpacity="0.62"
      />
      <path
        d="M59 88C65.0751 88 70 83.0751 70 77C70 70.9249 65.0751 66 59 66C52.9249 66 48 70.9249 48 77C48 83.0751 52.9249 88 59 88Z"
        fill={c}
        fillOpacity="0.8"
      />
      <path
        d="M14 79C18.4183 79 22 75.4183 22 71C22 66.5817 18.4183 63 14 63C9.58172 63 6 66.5817 6 71C6 75.4183 9.58172 79 14 79Z"
        fill={c}
        fillOpacity="0.48"
      />
    </svg>
  )
}

export function renderOgImage({ eyebrow, title, subtitle }: OgContent) {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px',
        color: COLORS.foreground,
        fontFamily: 'sans-serif',
        backgroundColor: COLORS.background,
        backgroundImage: `radial-gradient(820px 760px at 80% 48%, rgba(${COLORS.primaryRgb}, 0.32), transparent 62%)`,
      }}
    >
      {/* Hero: the logo mark, large, on the right - sized/placed to clear the
          title text (no overlap) while still bleeding off the edge. */}
      <div
        style={{
          position: 'absolute',
          top: 95,
          right: -55,
          display: 'flex',
          opacity: 0.85,
        }}
      >
        <LogoMark size={470} />
      </div>

      {/* Wordmark - kept large so the brand reads on a mobile thumbnail */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <LogoMark size={56} />
        <div
          style={{
            display: 'flex',
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: COLORS.foreground }}>index</span>
          <span style={{ color: COLORS.primary }}>folio</span>
        </div>
      </div>

      {/* Main copy - the focal hook. Narrower than the card so it never runs
          into the hero mark on the right. */}
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 560 }}>
        {eyebrow ? (
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 600,
              color: COLORS.primary,
              marginBottom: 16,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: COLORS.muted,
              marginTop: 24,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {/* Brand block: domain + open-source badge, grouped */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, fontWeight: 600 }}>
          indexfolio.dev
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 22,
            fontWeight: 600,
            color: COLORS.foreground,
            backgroundColor: `rgba(${COLORS.primaryRgb}, 0.16)`,
            border: `1px solid rgba(${COLORS.primaryRgb}, 0.5)`,
            borderRadius: 999,
            padding: '8px 18px',
          }}
        >
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: 999,
              backgroundColor: COLORS.primary,
              display: 'flex',
            }}
          />
          Free &amp; open-source
        </div>
      </div>
    </div>,
    { ...OG_SIZE },
  )
}
