import { AmbientBackground } from '@/components/AmbientBackground/AmbientBackground'
import { KnowledgeGraph } from './components/KnowledgeGraph/KnowledgeGraph'
import { HeroHeading } from './components/HeroHeading/HeroHeading'
import { DragHint } from './components/DragHint/DragHint'
import { ScrollHint } from './components/ScrollHint/ScrollHint'
import { ToolsSpine } from './components/ToolsSpine/ToolsSpine'

/*
  The home page: a full viewport 3D/2D knowledge graph hero, then the tools spine.
*/
export function Landing() {
  return (
    <>
      {/* Shared dot-grid backdrop; the hero fades into it. */}
      <AmbientBackground />
      <main>
        <section className="relative h-screen">
          {/* Fades the hero into the dot-grid at the bottom, dissolving into the tools spine. */}
          <div className="hero-fade-mask absolute inset-0">
            <KnowledgeGraph mode="hero" />
          </div>
          <HeroHeading />
          <DragHint />
          <ScrollHint />
        </section>

        <ToolsSpine />
      </main>
    </>
  )
}
