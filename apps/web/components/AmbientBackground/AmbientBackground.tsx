/*
  The content backdrop: a subtle "blueprint" dot grid behind page content (the
  Vercel/Linear aesthetic). It is neutral - the dots use the theme foreground at
  a low opacity, so they're dark on light and light on dark automatically - which
  means it never fights the page's own colours and reads the same in both themes.

  Two jobs: it gives the glass surfaces some texture to frost (a flat background
  has nothing to refract), and it adds a quiet sense of structure without the
  noise of coloured gradients. Masked to a soft vignette so it fades out toward
  the edges and stays behind the content, never competing with it.

  Fixed and non-interactive. Rendered by PageContainer, so the landing page keeps
  its own 3D starfield backdrop untouched.
*/
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="dot-grid pointer-events-none fixed inset-0 -z-10"
    />
  )
}
