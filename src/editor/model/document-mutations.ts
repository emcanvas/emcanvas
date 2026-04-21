import type { CanvasDocument, CanvasNode } from '../../foundation/types/canvas'
import {
  getNodeAtPath,
  findNodePathById,
  replaceNodeAtPath,
} from '../shared/tree-path'
import {
  validateInsertChildNode,
  type WidgetDefinitionRegistry,
} from './document-validation'

function cloneNode(node: CanvasNode): CanvasNode {
  return {
    ...node,
    props: { ...node.props },
    styles: {
      desktop: { ...node.styles.desktop },
      ...(node.styles.tablet ? { tablet: { ...node.styles.tablet } } : {}),
      ...(node.styles.mobile ? { mobile: { ...node.styles.mobile } } : {}),
    },
    children: (node.children ?? []).map(cloneNode),
  }
}

export function insertChildNode(
  document: CanvasDocument,
  parentId: string,
  node: CanvasNode,
  registry: WidgetDefinitionRegistry,
): CanvasDocument {
  const path = findNodePathById(document.root, parentId)

  if (!path) {
    throw new Error(`Cannot find node '${parentId}'`)
  }

  const parentNode = getNodeAtPath(document.root, path)

  if (!parentNode) {
    throw new Error(`Cannot find node '${parentId}'`)
  }

  validateInsertChildNode(parentNode, node, document.root, registry)

  return {
    ...document,
    root: replaceNodeAtPath(document.root, path, (currentNode) => ({
      ...currentNode,
      children: [...(currentNode.children ?? []), cloneNode(node)],
    })),
  }
}

export function insertNodeBelow(
  document: CanvasDocument,
  anchorId: string,
  node: CanvasNode,
  registry: WidgetDefinitionRegistry,
): CanvasDocument {
  const anchorPath = findNodePathById(document.root, anchorId)

  if (!anchorPath) {
    throw new Error(`Cannot find node '${anchorId}'`)
  }

  const parentPath = anchorPath.length === 0 ? [] : anchorPath.slice(0, -1)
  const insertIndex =
    anchorPath.length === 0
      ? (document.root.children ?? []).length
      : anchorPath.at(-1)! + 1
  const parentNode = getNodeAtPath(document.root, parentPath)

  if (!parentNode) {
    throw new Error(`Cannot find node '${anchorId}'`)
  }

  validateInsertChildNode(parentNode, node, document.root, registry)

  return {
    ...document,
    root: replaceNodeAtPath(document.root, parentPath, (currentNode) => {
      const children = currentNode.children ?? []
      const nextChildren = [...children]

      nextChildren.splice(insertIndex, 0, cloneNode(node))

      return {
        ...currentNode,
        children: nextChildren,
      }
    }),
  }
}

export function deleteNode(
  document: CanvasDocument,
  nodeId: string,
): CanvasDocument {
  const nodePath = findNodePathById(document.root, nodeId)

  if (!nodePath) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  if (nodePath.length === 0) {
    throw new Error('Cannot remove the root node')
  }

  const parentPath = nodePath.slice(0, -1)
  const nodeIndex = nodePath.at(-1)!

  return {
    ...document,
    root: replaceNodeAtPath(document.root, parentPath, (parentNode) => ({
      ...parentNode,
      children: (parentNode.children ?? []).filter(
        (_, index) => index !== nodeIndex,
      ),
    })),
  }
}

export function resolveSelectionAfterDelete(
  document: CanvasDocument,
  nodeId: string,
): string | null {
  const nodePath = findNodePathById(document.root, nodeId)

  if (!nodePath) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  if (nodePath.length === 0) {
    return null
  }

  const parentPath = nodePath.slice(0, -1)
  const nodeIndex = nodePath.at(-1)!
  const parentNode = getNodeAtPath(document.root, parentPath)

  if (!parentNode) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  const siblings = parentNode.children ?? []
  const previousSibling = siblings[nodeIndex - 1]

  if (previousSibling) {
    return previousSibling.id
  }

  const nextSibling = siblings[nodeIndex + 1]

  if (nextSibling) {
    return nextSibling.id
  }

  return parentPath.length === 0 ? null : parentNode.id
}
