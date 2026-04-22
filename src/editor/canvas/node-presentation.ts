import type { CanvasNode } from '../../foundation/types/canvas'
import { getNodeAtPath, type TreePath } from '../shared/tree-path'
import { widgetRegistry } from '../registry/widget-registry'

export function getCanvasNodeDisplayName(node: CanvasNode): string {
  return widgetRegistry.get(node.type)?.label ?? toTitleCase(node.type)
}

export function getCanvasNodeButtonLabel(node: CanvasNode): string {
  const displayName = getCanvasNodeDisplayName(node)
  const preview = getCanvasNodePreview(node)

  return preview ? `${displayName}: ${preview}` : displayName
}

export function getCanvasNodePath(
  rootNode: CanvasNode,
  path: TreePath,
): CanvasNode[] {
  const nodes = [rootNode]
  const currentPath: TreePath = []

  for (const index of path) {
    currentPath.push(index)

    const node = getNodeAtPath(rootNode, currentPath)

    if (!node) {
      break
    }

    nodes.push(node)
  }

  return nodes
}

function getCanvasNodePreview(node: CanvasNode): string | null {
  const title = node.props.title

  if (typeof title === 'string') {
    const trimmedTitle = title.trim()

    if (trimmedTitle.length > 0) {
      return trimmedTitle
    }
  }

  const label = node.props.label

  if (typeof label === 'string') {
    const trimmedLabel = label.trim()

    if (trimmedLabel.length > 0) {
      return trimmedLabel
    }
  }

  const text = node.props.text

  if (typeof text === 'string') {
    const trimmedText = text.trim()

    if (trimmedText.length > 0) {
      return trimmedText
    }
  }

  const href = node.props.href

  if (typeof href === 'string' && href.trim().length > 0) {
    return href.trim()
  }

  const alt = node.props.alt

  if (typeof alt === 'string' && alt.trim().length > 0) {
    return alt.trim()
  }

  const src = node.props.src

  if (typeof src === 'string' && src.trim().length > 0) {
    return src.trim()
  }

  return null
}

function toTitleCase(value: string): string {
  return value.slice(0, 1).toUpperCase() + value.slice(1)
}
