import type { CanvasDocument, CanvasNode } from '../../foundation/types/canvas'
import { getNodeAtPath, findNodePathById, replaceNodeAtPath } from '../shared/tree-path'
import { validateInsertChildNode, type WidgetDefinitionRegistry } from './document-validation'

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
