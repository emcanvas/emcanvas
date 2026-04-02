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

function collectNodeIds(node: CanvasNode, ids: Set<string> = new Set<string>()): Set<string> {
  if (ids.has(node.id)) {
    throw new Error(`Node id '${node.id}' is duplicated in inserted subtree`)
  }

  ids.add(node.id)

  for (const child of node.children ?? []) {
    collectNodeIds(child, ids)
  }

  return ids
}

export function validateInsertChildNode(parent: CanvasNode, child: CanvasNode, root: CanvasNode): void {
  if (!isCanvasNode(child)) {
    throw new Error('Inserted node must satisfy the canvas node contract')
  }

  for (const nodeId of collectNodeIds(child)) {
    if (hasNodeId(root, nodeId)) {
      throw new Error(`Node id '${nodeId}' already exists`)
    }
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
