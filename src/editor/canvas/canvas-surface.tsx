import { useRef } from 'react'
import type { CanvasDocument } from '../../foundation/types/canvas'
import { buildRendererStylesheet } from '../../renderer/styles/build-renderer-stylesheet'
import { getNodeAtPath, findNodePathById } from '../shared/tree-path'
import { getCanvasNodeDisplayName } from './node-presentation'
import { CanvasNodeRenderer } from './canvas-node-renderer'
import { SelectionOutlineLayer } from './selection-outline-layer'

export interface CanvasSurfaceProps {
  document: CanvasDocument
  selectedNodeId?: string | null
  onSelectNode?: (nodeId: string) => void
  onCreateFirstBlock?: (
    nodeType:
      | 'section'
      | 'heading'
      | 'text'
      | 'button'
      | 'image'
      | 'hero'
      | 'features/cards'
      | 'columns',
  ) => void
}

export function CanvasSurface({
  document,
  selectedNodeId = null,
  onSelectNode,
  onCreateFirstBlock,
}: CanvasSurfaceProps) {
  const surfaceRef = useRef<HTMLElement>(null)
  const isEmpty = (document.root.children?.length ?? 0) === 0
  const selectedNodePath =
    selectedNodeId === null
      ? null
      : findNodePathById(document.root, selectedNodeId)
  const selectedNode = selectedNodePath
    ? getNodeAtPath(document.root, selectedNodePath)
    : null
  const stylesheet = buildRendererStylesheet(document.root)
  const surfaceStatus = isEmpty
    ? 'Empty canvas. Start with a section or a ready-made block.'
    : selectedNode
      ? `Selected block: ${getCanvasNodeDisplayName(selectedNode)}`
      : 'Select a block on the canvas to inspect and edit it.'

  return (
    <section
      ref={surfaceRef}
      aria-label="Canvas surface"
      className="emc-canvas-surface"
    >
      <div className="emc-canvas-surface__status" aria-live="polite">
        <strong>{surfaceStatus}</strong>
      </div>
      {stylesheet ? (
        <style data-emcanvas-editor-styles>{stylesheet}</style>
      ) : null}
      {isEmpty ? (
        <section
          aria-label="Empty canvas state"
          className="emc-canvas-empty-state"
        >
          <h2>Start from scratch</h2>
          <p>
            The layout is valid and intentionally blank. Add your first block
            when you are ready.
          </p>
          <div className="emc-canvas-empty-state__actions">
            <button
              type="button"
              onClick={() => onCreateFirstBlock?.('section')}
            >
              Add section
            </button>
            <button type="button" onClick={() => onCreateFirstBlock?.('hero')}>
              Add hero
            </button>
            <button
              type="button"
              onClick={() => onCreateFirstBlock?.('columns')}
            >
              Add columns
            </button>
            <button
              type="button"
              onClick={() => onCreateFirstBlock?.('heading')}
            >
              Add heading
            </button>
          </div>
        </section>
      ) : null}
      <div data-emcanvas-root>
        <CanvasNodeRenderer
          node={document.root}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      </div>
      <SelectionOutlineLayer
        surfaceRef={surfaceRef}
        selectedNodeId={selectedNodeId}
        measurementKey={document}
      />
    </section>
  )
}
