// Brand hex for JS contexts that can't read CSS vars (OG image, manifest). Mirrors the .dark tokens
// in styles/theme.css - keep in sync by hand (CSS can't be imported into Node render contexts).
export const COLORS = {
  background: '#0a0a0b', // hsl(240 10% 4%)
  foreground: '#fafafa', // hsl(0 0% 98%)
  muted: '#a1a1aa', // --color-neutral (dark)
  primary: '#635bff',
  // primary as "r, g, b" for rgba() tints/glows where alpha is needed.
  primaryRgb: '99, 91, 255',
} as const
