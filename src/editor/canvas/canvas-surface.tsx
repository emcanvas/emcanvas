import { useRef } from 'react'
import type { CanvasDocument } from '../../foundation/types/canvas'
import { getNodeAtPath, findNodePathById } from '../shared/tree-path'
import { getCanvasNodeDisplayName } from './node-presentation'
import { CanvasNodeRenderer } from './canvas-node-renderer'
import { SelectionOutlineLayer } from './selection-outline-layer'

export interface CanvasSurfaceProps {
  document: CanvasDocument
  selectedNodeId?: string | null
  onSelectNode?: (nodeId: string) => void
  onCreateFirstBlock?: (
    nodeType: 'heading' | 'text' | 'button' | 'columns',
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
  const surfaceStatus = isEmpty
    ? 'Canvas is empty. Choose a first block to get started.'
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
      {isEmpty ? (
        <section
          aria-label="Empty canvas state"
          className="emc-canvas-empty-state"
        >
          <h2>Start your page</h2>
          <p>This canvas is empty. Add your first block to get started.</p>
          <div className="emc-canvas-empty-state__actions">
            <button
              type="button"
              onClick={() => onCreateFirstBlock?.('heading')}
            >
              Add first heading
            </button>
            <button type="button" onClick={() => onCreateFirstBlock?.('text')}>
              Add first text
            </button>
            <button
              type="button"
              onClick={() => onCreateFirstBlock?.('button')}
            >
              Add first button
            </button>
            <button
              type="button"
              onClick={() => onCreateFirstBlock?.('columns')}
            >
              Add first columns
            </button>
          </div>
        </section>
      ) : null}
      <CanvasNodeRenderer
        node={document.root}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
      />
      <SelectionOutlineLayer
        surfaceRef={surfaceRef}
        selectedNodeId={selectedNodeId}
        measurementKey={document}
      />
    </section>
  )
}
