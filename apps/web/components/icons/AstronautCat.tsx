import Image from 'next/image'

type AstronautCatProps = {
  size?: number
  className?: string
  /** Eager-load + preload when this is the above-the-fold hero (e.g. the 404). */
  priority?: boolean
}

// Source sprites are 25w x 46h pixel art (used as the intrinsic ratio).
const INTRINSIC = { width: 25, height: 46 }

/*
  Themed pixel-art astronaut cat. Two purpose-drawn sprites (warm cat for dark,
  cool outlined cat for light) are both rendered and toggled with CSS dark:
  classes - SSR-safe and no theme flash. Reused for the 404 mascot and easter
  eggs. `size` is the rendered height in px; width follows the sprite aspect.

  We pass the intrinsic size and drive the display height via style with
  width:auto, so the aspect ratio holds (Tailwind's preflight forces height:auto
  on images, which otherwise trips next/image's ratio warning).
*/
export function AstronautCat({
  size = 64,
  className,
  priority = false,
}: AstronautCatProps) {
  const classes = (visibility: string) =>
    [visibility, className].filter(Boolean).join(' ')

  return (
    <>
      <Image
        src="/astronaut-cat-light.svg"
        alt=""
        aria-hidden="true"
        width={INTRINSIC.width}
        height={INTRINSIC.height}
        unoptimized
        priority={priority}
        style={{ height: size, width: 'auto' }}
        className={classes('block dark:hidden')}
      />
      <Image
        src="/astronaut-cat-dark.svg"
        alt=""
        aria-hidden="true"
        width={INTRINSIC.width}
        height={INTRINSIC.height}
        unoptimized
        priority={priority}
        style={{ height: size, width: 'auto' }}
        className={classes('hidden dark:block')}
      />
    </>
  )
}
