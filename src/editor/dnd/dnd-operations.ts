import { createNodeId } from '../../foundation/shared/ids'
import type { CanvasDocument, CanvasNode } from '../../foundation/types/canvas'
import { validateInsertChildNode } from '../model/document-validation'
import { widgetRegistry } from '../registry/widget-registry'
import {
  findNodePathById,
  getNodeAtPath,
  replaceNodeAtPath,
} from '../shared/tree-path'
import { insertChildNode } from '../model/document-mutations'

function removeNodeAtPath(root: CanvasNode, path: number[]): CanvasNode {
  if (path.length === 0) {
    throw new Error('Cannot remove the root node')
  }

  const parentPath = path.slice(0, -1)
  const nodeIndex = path[path.length - 1]

  return replaceNodeAtPath(root, parentPath, (parentNode) => ({
    ...parentNode,
    children: (parentNode.children ?? []).filter(
      (_, index) => index !== nodeIndex,
    ),
  }))
}

function isAncestorPath(ancestor: number[], descendant: number[]) {
  return (
    ancestor.length < descendant.length &&
    ancestor.every((segment, index) => segment === descendant[index])
  )
}

function arePathsEqual(left: number[], right: number[]) {
  return (
    left.length === right.length &&
    left.every((segment, index) => segment === right[index])
  )
}

function normalizeColumnsCount(value: unknown): number {
  return typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 2 &&
    value <= 4
    ? value
    : 2
}

function createBaseNodeFromWidgetType(nodeType: string): CanvasNode {
  const definition = widgetRegistry.get(nodeType)

  if (!definition) {
    throw new Error(`Unknown widget type: '${nodeType}'`)
  }

  return {
    id: createNodeId(
      nodeType === 'features/cards' ? 'features-cards' : nodeType,
    ),
    type: definition.type,
    props: { ...definition.defaultProps },
    styles: { desktop: {} },
    children: [],
  }
}

export function createNodeFromWidgetType(nodeType: string): CanvasNode {
  const node = createBaseNodeFromWidgetType(nodeType)

  if (node.type !== 'columns') {
    return node
  }

  return {
    ...node,
    props: {
      ...node.props,
      columns: normalizeColumnsCount(node.props.columns),
    },
    children: Array.from(
      { length: normalizeColumnsCount(node.props.columns) },
      () => createBaseNodeFromWidgetType('container'),
    ),
  }
}

export function createNode(
  document: CanvasDocument,
  parentId: string,
  nodeType: string,
): CanvasDocument {
  return insertChildNode(
    document,
    parentId,
    createNodeFromWidgetType(nodeType),
    widgetRegistry,
  )
}

export function deleteNode(
  document: CanvasDocument,
  nodeId: string,
): CanvasDocument {
  const nodePath = findNodePathById(document.root, nodeId)

  if (!nodePath) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  return {
    ...document,
    root: removeNodeAtPath(document.root, nodePath),
  }
}

export function moveNode(
  document: CanvasDocument,
  nodeId: string,
  targetParentId: string,
): CanvasDocument {
  const nodePath = findNodePathById(document.root, nodeId)
  const targetParentPath = findNodePathById(document.root, targetParentId)

  if (!nodePath) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  if (!targetParentPath) {
    throw new Error(`Cannot find node '${targetParentId}'`)
  }

  if (nodePath.length === 0) {
    throw new Error('Cannot move the root node')
  }

  if (arePathsEqual(nodePath.slice(0, -1), targetParentPath)) {
    return document
  }

  if (isAncestorPath(nodePath, targetParentPath)) {
    throw new Error(`Node '${nodeId}' cannot be moved into its own descendant`)
  }

  const node = getNodeAtPath(document.root, nodePath)
  const targetParent = getNodeAtPath(document.root, targetParentPath)

  if (!node || !targetParent) {
    throw new Error('Cannot resolve move operation')
  }

  const documentWithoutNode = {
    ...document,
    root: removeNodeAtPath(document.root, nodePath),
  }

  const nextTargetParentPath = findNodePathById(
    documentWithoutNode.root,
    targetParentId,
  )

  if (!nextTargetParentPath) {
    throw new Error(`Cannot find node '${targetParentId}'`)
  }

  const nextTargetParent = getNodeAtPath(
    documentWithoutNode.root,
    nextTargetParentPath,
  )

  if (!nextTargetParent) {
    throw new Error(`Cannot find node '${targetParentId}'`)
  }

  validateInsertChildNode(
    nextTargetParent,
    node,
    documentWithoutNode.root,
    widgetRegistry,
  )

  return insertChildNode(
    documentWithoutNode,
    targetParentId,
    node,
    widgetRegistry,
  )
}
