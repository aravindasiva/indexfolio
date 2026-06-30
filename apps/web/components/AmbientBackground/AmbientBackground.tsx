/*
  Neutral blueprint dot-grid content backdrop. Dots use the theme foreground at
  low opacity so they read the same in both themes without fighting page colours.
  Gives glass surfaces texture to frost; masked to a vignette so it stays behind
  content. Rendered by PageContainer, so the landing keeps its own starfield.
*/
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="dot-grid pointer-events-none fixed inset-0 -z-10"
    />
  )
}
