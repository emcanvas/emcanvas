import type { CanvasDocument } from '../../foundation/types/canvas'
import type { EditorBreakpoint } from '../state/editor-store'
import { findNodePathById, replaceNodeAtPath } from '../shared/tree-path'
import { updateResponsiveStyles } from '../styles/style-mutations'

export function updateNodeStyles(
  document: CanvasDocument,
  nodeId: string,
  breakpoint: EditorBreakpoint,
  nextStyles: Record<string, unknown>,
): CanvasDocument {
  const path = findNodePathById(document.root, nodeId)

  if (!path) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  return {
    ...document,
    root: replaceNodeAtPath(document.root, path, (node) => ({
      ...node,
      styles: updateResponsiveStyles(node.styles, breakpoint, nextStyles),
    })),
  }
}
