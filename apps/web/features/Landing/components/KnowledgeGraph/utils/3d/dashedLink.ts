import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'

// Dotted ETF edges need a fat line: the library's default link can't be dashed,
// and a plain THREE.Line ignores width. Base/active widths in px (thicker when
// the connected node is hovered).
export const DASHED_WIDTH = 2
export const DASHED_WIDTH_ACTIVE = 3.5

type Point = { x: number; y: number; z: number }

export function createDashedLine(opts: {
  color: string
  opacity: number
  linewidth: number
  width: number
  height: number
}): Line2 {
  const material = new LineMaterial({
    color: new THREE.Color(opts.color).getHex(),
    linewidth: opts.linewidth,
    dashed: true,
    dashSize: 1.6,
    gapSize: 1.4,
    transparent: true,
    opacity: opts.opacity,
  })
  // Required for screen-space line width; keep in sync with the canvas size.
  material.resolution.set(opts.width, opts.height)
  const geometry = new LineGeometry()
  geometry.setPositions([0, 0, 0, 0, 0, 0])
  return new Line2(geometry, material)
}

export function setDashedLineEndpoints(
  line: Line2,
  start: Point,
  end: Point,
): void {
  line.geometry.setPositions([start.x, start.y, start.z, end.x, end.y, end.z])
  // Required for the dashes to space out along the segment.
  line.computeLineDistances()
}
