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
    icons: [{ src: '/icon.png', sizes: 'any', type: 'image/png' }],
  }
}
