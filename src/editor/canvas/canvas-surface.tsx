import type { CanvasDocument } from '../../foundation/types/canvas'
import { CanvasNodeRenderer } from './canvas-node-renderer'
import { SelectionOutlineLayer } from './selection-outline-layer'

export interface CanvasSurfaceProps {
  document: CanvasDocument
}

export function CanvasSurface({ document }: CanvasSurfaceProps) {
  return (
    <section aria-label="Canvas surface">
      <CanvasNodeRenderer node={document.root} />
      <SelectionOutlineLayer />
    </section>
  )
}
