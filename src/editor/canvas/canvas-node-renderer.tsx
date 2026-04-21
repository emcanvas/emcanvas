import type { CanvasNode } from '../../foundation/types/canvas'
import { getCanvasNodeButtonLabel } from './node-presentation'

export interface CanvasNodeRendererProps {
  node: CanvasNode
  selectedNodeId?: string | null
  onSelectNode?: (nodeId: string) => void
  depth?: number
}

export function CanvasNodeRenderer({
  node,
  selectedNodeId = null,
  onSelectNode,
  depth = 0,
}: CanvasNodeRendererProps) {
  const selected = selectedNodeId === node.id

  return (
    <article
      className="emc-canvas-node"
      data-node-id={node.id}
      data-node-type={node.type}
      data-node-depth={depth}
      data-selected={selected ? 'true' : 'false'}
    >
      <button
        className="emc-canvas-node__button"
        type="button"
        aria-pressed={selected}
        onClick={() => onSelectNode?.(node.id)}
      >
        <strong>{getCanvasNodeButtonLabel(node)}</strong>
      </button>
      {node.children?.length ? (
        <div className="emc-canvas-node__children">
          {node.children.map((child) => (
            <CanvasNodeRenderer
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </article>
  )
}
