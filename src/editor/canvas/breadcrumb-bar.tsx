import type { CanvasNode } from '../../foundation/types/canvas'
import { findNodePathById } from '../shared/tree-path'
import {
  getCanvasNodeDisplayName,
  getCanvasNodePath,
} from './node-presentation'

export interface BreadcrumbBarProps {
  rootNode: CanvasNode
  selectedNodeId?: string | null
  onSelectNode?: (nodeId: string) => void
}

export function BreadcrumbBar({
  rootNode,
  selectedNodeId = null,
  onSelectNode,
}: BreadcrumbBarProps) {
  const selectedPath =
    selectedNodeId === null
      ? []
      : (findNodePathById(rootNode, selectedNodeId) ?? [])
  const nodes = getCanvasNodePath(rootNode, selectedPath)

  return (
    <nav aria-label="Canvas breadcrumbs" className="emc-canvas-breadcrumbs">
      <ol className="emc-canvas-breadcrumbs__list">
        {nodes.map((node, index) => {
          const selected = index === nodes.length - 1

          return (
            <li key={node.id} className="emc-canvas-breadcrumbs__item">
              <button
                type="button"
                aria-current={selected ? 'page' : 'false'}
                className="emc-canvas-breadcrumbs__button"
                onClick={() => onSelectNode?.(node.id)}
              >
                {getCanvasNodeDisplayName(node)}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
