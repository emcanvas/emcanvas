import type { CanvasDocument } from '../../foundation/types/canvas'
import { findNodePathById, replaceNodeAtPath } from '../shared/tree-path'

export function updateNodeProps(
  document: CanvasDocument,
  nodeId: string,
  nextProps: Record<string, unknown>,
): CanvasDocument {
  const path = findNodePathById(document.root, nodeId)

  if (!path) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  return {
    ...document,
    root: replaceNodeAtPath(document.root, path, (node) => ({
      ...node,
      props: {
        ...node.props,
        ...nextProps,
      },
    })),
  }
}
