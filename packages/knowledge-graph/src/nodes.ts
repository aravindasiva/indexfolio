// Single source of truth. Powers the landing graph and the Phase 2 minimap.
// Add nodes and edges here as new app features are built.
export type NodeType = 'home' | 'tool'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  href: string
}

export interface GraphEdge {
  source: string
  target: string
}

export const nodes: GraphNode[] = [
  { id: 'home', label: 'Indexfolio', type: 'home', href: '/' },
  { id: 'screener', label: 'ETF Screener', type: 'tool', href: '/screener' },
  {
    id: 'calculator',
    label: 'Tax Calculator',
    type: 'tool',
    href: '/calculator',
  },
  { id: 'overlap', label: 'Overlap Analyser', type: 'tool', href: '/overlap' },
  {
    id: 'tax-guides',
    label: 'Tax Guides',
    type: 'tool',
    href: '/tax/portugal',
  },
]

export const edges: GraphEdge[] = [
  { source: 'home', target: 'screener' },
  { source: 'home', target: 'calculator' },
  { source: 'home', target: 'overlap' },
  { source: 'home', target: 'tax-guides' },
]
