import { KnowledgeGraph } from './components/KnowledgeGraph/KnowledgeGraph'
import { DragHint } from './components/DragHint/DragHint'
import { ScrollHint } from './components/ScrollHint/ScrollHint'
import { ToolsSpine } from './components/ToolsSpine/ToolsSpine'

/*
  The home page: a full viewport 3D/2D knowledge graph hero, then the tools spine.
*/
export function Landing() {
  return (
    <main>
      <section className="relative h-screen">
        {/* Mask (not an opaque overlay) fades the starfield out toward the
            bottom, so the shared ambient background shows through unbroken and
            the hero dissolves into the tools spine with no section cutoff. */}
        <div className="hero-fade-mask absolute inset-0">
          <KnowledgeGraph mode="hero" />
        </div>
        <DragHint />
        <ScrollHint />
      </section>

      <ToolsSpine />
    </main>
  )
}
