import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '../constants'
import { COLORS } from '../colors'

// App is dark-first, so theme and background both track the dark surface.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: COLORS.background,
    theme_color: COLORS.background,
    // 'any' is valid for the SVG only; using it on a raster triggers Chrome's
    // "size is not correct" warning.
    icons: [
      { src: '/indexfolio.png', sizes: '192x192', type: 'image/png' },
      { src: '/indexfolio.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
