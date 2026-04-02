import type { CanvasDocument } from '../../foundation/types/canvas'
import { BreadcrumbBar } from './breadcrumb-bar'
import { CanvasSurface } from './canvas-surface'

export interface CanvasViewportProps {
  document: CanvasDocument
}

export function CanvasViewport({ document }: CanvasViewportProps) {
  return (
    <section aria-label="Canvas viewport">
      <BreadcrumbBar rootNode={document.root} />
      <CanvasSurface document={document} />
    </section>
  )
}
