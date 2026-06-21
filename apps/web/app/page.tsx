import { KnowledgeGraph } from '@/components/KnowledgeGraph/KnowledgeGraph'
import { DragHint } from '@/components/Landing/DragHint'
import { ScrollHint } from '@/components/Landing/ScrollHint'
import { ToolsSpine } from '@/components/Landing/ToolsSpine'

export default function Home() {
  return (
    <main>
      <section className="relative h-screen">
        <KnowledgeGraph mode="hero" />
        <DragHint />
        <ScrollHint />
        {/* Fade the starfield's edge into the page so the space tapers off
            gradually. Same background continues below - no section cutoff. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-background"
        />
      </section>

      <ToolsSpine />
    </main>
  )
}
