import { edges as graphEdges } from '@indexfolio/knowledge-graph'
import type { NodeType } from '@indexfolio/knowledge-graph'

/*
  Shared knowledge-graph logic used by both the 2D and 3D renderers, so the
  hover-highlight behaviour stays identical between them.

  The 2D graph passes NODE_COLORS straight to SVG, so CSS variables resolve
  against the active theme. The 3D graph resolves --foreground to a concrete
  colour at runtime (three.js materials cannot read CSS variables) - see
  KnowledgeGraph3D.
*/
export const NODE_COLORS: Record<NodeType, string> = {
  home: 'var(--foreground)',
  tool: '#635BFF',
  // Shares the tool indigo so the ETF node reads as part of the same family.
  etf: '#635BFF',
}

// Opacities that drive the hover highlight. Shared so 2D and 3D match exactly.
export const NODE_DIM_OPACITY = 0.12
export const EDGE_BASE_OPACITY = 0.4
export const EDGE_ACTIVE_OPACITY = 0.95
export const EDGE_DIM_OPACITY = 0.06

// Dotted (ETF) edges read as indigo connectors in both 2D and 3D, so they stay
// visible in either theme; they share the solid edges' hover opacity behaviour.
export const EDGE_DASHED_COLOR = NODE_COLORS.etf

// Undirected adjacency: which nodes are directly connected to which.
function buildAdjacency(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  const connect = (a: string, b: string) => {
    const set = map.get(a) ?? new Set<string>()
    set.add(b)
    map.set(a, set)
  }
  for (const edge of graphEdges) {
    connect(edge.source, edge.target)
    connect(edge.target, edge.source)
  }
  return map
}

export const ADJACENCY = buildAdjacency()

// A node stays lit when nothing is hovered, when it is the hovered node, or
// when it is a direct neighbour of the hovered node.
export function isConnected(nodeId: string, hoveredId: string | null): boolean {
  if (!hoveredId) return true
  if (nodeId === hoveredId) return true
  return ADJACENCY.get(hoveredId)?.has(nodeId) ?? false
}

export function nodeOpacity(nodeId: string, hoveredId: string | null): number {
  return isConnected(nodeId, hoveredId) ? 1 : NODE_DIM_OPACITY
}

export function edgeOpacity(
  srcId: string,
  tgtId: string,
  hoveredId: string | null,
): number {
  if (!hoveredId) return EDGE_BASE_OPACITY
  if (srcId === hoveredId || tgtId === hoveredId) return EDGE_ACTIVE_OPACITY
  return EDGE_DIM_OPACITY
}
