import { isCanvasNode } from '../../foundation/model/guards'
import type { CanvasNode } from '../../foundation/types/canvas'
import { widgetRegistry } from '../registry/widget-registry'

function getWidgetDefinition(type: string) {
  const definition = widgetRegistry.get(type)

  if (!definition) {
    throw new Error(`Unknown widget type: '${type}'`)
  }

  return definition
}

function hasNodeId(node: CanvasNode, nodeId: string): boolean {
  if (node.id === nodeId) {
    return true
  }

  return (node.children ?? []).some((child) => hasNodeId(child, nodeId))
}

export function validateInsertChildNode(parent: CanvasNode, child: CanvasNode, root: CanvasNode): void {
  if (!isCanvasNode(child)) {
    throw new Error('Inserted node must satisfy the canvas node contract')
  }

  if (hasNodeId(root, child.id)) {
    throw new Error(`Node id '${child.id}' already exists`)
  }

  const parentDefinition = getWidgetDefinition(parent.type)
  getWidgetDefinition(child.type)

  if (parentDefinition.allowedChildren === 'none' || parentDefinition.allowedChildren === undefined) {
    throw new Error(`Node '${parent.id}' of type '${parent.type}' cannot accept children`)
  }

  if (
    Array.isArray(parentDefinition.allowedChildren) &&
    !parentDefinition.allowedChildren.includes(child.type)
  ) {
    throw new Error(
      `Node '${parent.id}' of type '${parent.type}' only accepts children of type: ${parentDefinition.allowedChildren.join(', ')}`,
    )
  }
}
