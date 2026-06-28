import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '../constants'
import { COLORS } from '../colors'

// Web app manifest: installability + the browser theme/background colour. The
// app is dark-first, so both colours track the dark surface.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: COLORS.background,
    theme_color: COLORS.background,
    // The 32x32 raster favicon, plus the scalable logo for installs. 'any' is
    // valid (and intended) for an SVG; using it on a raster is what triggered
    // Chrome's "size is not correct" warning.
    icons: [
      { src: '/icon.png', sizes: '32x32', type: 'image/png' },
      { src: '/indexfolio.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
