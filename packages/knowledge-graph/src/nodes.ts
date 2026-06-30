// Single source of truth for the landing graph and minimap. Node type drives
// downstream treatment: 'tool' nodes appear in the nav/tools spine, 'home' and
// 'etf' nodes deliberately do not (graph-only).
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

// Order matters: spokes seed around the hub in array order, so keep related
// nodes adjacent (ETF cluster next to its Screener). Nav and spine read the same order.
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
  // ETF hub (/etf, a random fund), hangs off home like the tools.
  { id: 'etf', label: 'ETF', type: 'etf', href: '/etf', shortLabel: 'ETF' },
  // Detail surface (/etf/[ticker]); label cycles "ETF <ticker>" in the renderer.
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
  // Detail node reached from both the ETF hub and the Screener; dotted = dynamic.
  { source: 'etf', target: 'etf-detail', dashed: true },
  { source: 'screener', target: 'etf-detail', dashed: true },
]
