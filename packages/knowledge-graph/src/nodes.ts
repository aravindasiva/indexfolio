// Single source of truth. Powers the landing graph and the Phase 2 minimap.
// Add nodes and edges here as new app features are built.
//
// Node types drive how each node is treated downstream:
//   home - the central hub (secret trigger, not a link)
//   tool - a top-level feature; listed in the nav and the tools spine
//   etf  - the ETF surfaces (the /etf hub node and the cycling "ETF <ticker>"
//          detail node). Graph-only flourishes, deliberately not 'tool's, so
//          they stay out of the nav and the tools spine.
export type NodeType = 'home' | 'tool' | 'etf'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  href: string
  /** Compact label for the nav pill (falls back to `label`). */
  shortLabel?: string
  /** One-line summary for the tools spine. */
  description?: string
}

export interface GraphEdge {
  source: string
  target: string
  /** Render as a dotted line - used for the "random" ETF shortcut. */
  dashed?: boolean
}

// Order matters for the 2D layout: spokes are seeded around the hub in array
// order, so keep related nodes adjacent (the ETF cluster sits next to the
// Screener it belongs to). The nav and tools spine read the same order.
export const nodes: GraphNode[] = [
  { id: 'home', label: 'Indexfolio', type: 'home', href: '/' },
  {
    id: 'screener',
    label: 'ETF Screener',
    type: 'tool',
    href: '/screener',
    shortLabel: 'Screener',
    description: 'Filter UCITS ETFs by TER, domicile, type, and asset class.',
  },
  // The ETF hub (/etf, a random fund) hangs off the home node like the tools.
  { id: 'etf', label: 'ETF', type: 'etf', href: '/etf', shortLabel: 'ETF' },
  // The detail surface (/etf/[ticker]). Its label cycles "ETF <ticker>" in the
  // renderer; it sits between the ETF hub and the Screener since both lead here.
  {
    id: 'etf-detail',
    label: 'ETF detail',
    type: 'etf',
    href: '/etf',
    shortLabel: 'ETF detail',
  },
  {
    id: 'calculator',
    label: 'Tax Calculator',
    type: 'tool',
    href: '/calculator',
    shortLabel: 'Calculator',
    description: 'Real after-tax projections using actual country tax rules.',
  },
  {
    id: 'overlap',
    label: 'Overlap Analyser',
    type: 'tool',
    href: '/overlap',
    shortLabel: 'Overlap',
    description: 'See what you actually own across multiple funds.',
  },
  {
    id: 'tax-guides',
    label: 'Tax Guides',
    type: 'tool',
    href: '/tax/portugal',
    shortLabel: 'Tax guides',
    description: 'Interactive, country-specific tax guides. Portugal first.',
  },
]

export const edges: GraphEdge[] = [
  { source: 'home', target: 'screener' },
  { source: 'home', target: 'calculator' },
  { source: 'home', target: 'overlap' },
  { source: 'home', target: 'tax-guides' },
  { source: 'home', target: 'etf' },
  // The detail node is reached from both the ETF hub and the Screener; dotted to
  // mark it as the dynamic, per-fund surface.
  { source: 'etf', target: 'etf-detail', dashed: true },
  { source: 'screener', target: 'etf-detail', dashed: true },
]
