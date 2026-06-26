// Brand hex for JS contexts that can't read CSS vars (OG image, manifest,
// global-error). Mirror the .dark tokens in globals.css.
export const COLORS = {
  background: '#0a0a0f',
  foreground: '#fafafa',
  muted: '#a1a1aa',
  primary: '#635bff',
  // primary as "r, g, b" for rgba() tints/glows where alpha is needed.
  primaryRgb: '99, 91, 255',
} as const
