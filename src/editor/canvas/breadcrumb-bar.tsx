import type { CanvasNode } from '../../foundation/types/canvas'

export interface BreadcrumbBarProps {
  rootNode: CanvasNode
}

export function BreadcrumbBar({ rootNode }: BreadcrumbBarProps) {
  return (
    <nav aria-label="Canvas breadcrumbs">
      <ol>
        <li>{rootNode.type}</li>
      </ol>
    </nav>
  )
}
