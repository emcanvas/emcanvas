import type { CanvasNode } from '../../foundation/types/canvas'

export type TreePath = number[]

export function findNodePathById(node: CanvasNode, nodeId: string): TreePath | null {
  if (node.id === nodeId) {
    return []
  }

  const children = node.children ?? []

  for (const [index, child] of children.entries()) {
    const childPath = findNodePathById(child, nodeId)

    if (childPath) {
      return [index, ...childPath]
    }
  }

  return null
}

export function getNodeAtPath(node: CanvasNode, path: TreePath): CanvasNode | null {
  let current: CanvasNode | undefined = node

  for (const index of path) {
    current = current.children?.[index]

    if (!current) {
      return null
    }
  }

  return current
}

export function replaceNodeAtPath(
  node: CanvasNode,
  path: TreePath,
  updater: (node: CanvasNode) => CanvasNode,
): CanvasNode {
  if (path.length === 0) {
    return updater(node)
  }

  const [index, ...rest] = path
  const children = node.children ?? []
  const child = children[index]

  if (!child) {
    throw new Error(`Invalid tree path: ${path.join('.')}`)
  }

  const nextChildren = [...children]
  nextChildren[index] = replaceNodeAtPath(child, rest, updater)

  return {
    ...node,
    children: nextChildren,
  }
}
