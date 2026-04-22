import type { CanvasDocument } from '../../foundation/types/canvas'
import { BreadcrumbBar } from './breadcrumb-bar'
import { CanvasSurface } from './canvas-surface'

export interface CanvasViewportProps {
  document: CanvasDocument
  selectedNodeId?: string | null
  onSelectNode?: (nodeId: string) => void
  onCreateFirstBlock?: (
    nodeType:
      | 'heading'
      | 'text'
      | 'button'
      | 'image'
      | 'hero'
      | 'features/cards'
      | 'columns',
  ) => void
}

export function CanvasViewport({
  document,
  selectedNodeId = null,
  onSelectNode,
  onCreateFirstBlock,
}: CanvasViewportProps) {
  return (
    <section aria-label="Canvas viewport" className="emc-canvas-viewport">
      <BreadcrumbBar
        rootNode={document.root}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
      />
      <CanvasSurface
        document={document}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
        onCreateFirstBlock={onCreateFirstBlock}
      />
    </section>
  )
}
