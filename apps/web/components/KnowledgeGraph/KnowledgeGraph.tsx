'use client'

import dynamic from 'next/dynamic'
import { nodes as graphNodes } from '@indexfolio/knowledge-graph'
import { KnowledgeGraph2D } from './KnowledgeGraph2D'
import { useGraphMode } from './_lib/useGraphMode'

// The 3D graph pulls in three.js, so it is lazy-loaded (and client-only). It is
// only fetched when the device can actually use it - the 2D fallback ships in
// the main bundle.
const KnowledgeGraph3D = dynamic(
  () => import('./KnowledgeGraph3D').then((m) => m.KnowledgeGraph3D),
  { ssr: false },
)

type KnowledgeGraphProps = { mode: 'hero' | 'overlay' }

export function KnowledgeGraph({ mode }: KnowledgeGraphProps) {
  const graphMode = useGraphMode()

  return (
    <>
      {/* The visual graph is decorative; this is the real navigable map for
          screen readers and crawlers. Rendered regardless of 2D/3D. */}
      <nav aria-label="Explore Indexfolio" className="sr-only">
        <ul>
          {graphNodes.map((node) => (
            <li key={node.id}>
              <a href={node.href}>{node.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {graphMode === '3d' && <KnowledgeGraph3D mode={mode} />}
      {graphMode === '2d' && <KnowledgeGraph2D mode={mode} />}
      {/* graphMode === 'loading' renders nothing for one tick while we detect
          capability, avoiding a 2D-to-3D flash. */}
    </>
  )
}
