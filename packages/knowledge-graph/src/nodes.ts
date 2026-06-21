// Single source of truth. Powers the landing graph and the Phase 2 minimap.
// Add nodes and edges here as new app features are built.
export type NodeType = 'home' | 'tool'

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
}

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
]
