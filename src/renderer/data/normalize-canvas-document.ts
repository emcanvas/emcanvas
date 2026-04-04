import { isCanvasDocument } from '@emcanvas/foundation/model/guards'
import type { CanvasNode } from '@emcanvas/foundation/types/canvas'
import type {
  NormalizedCanvasDocument,
  NormalizedCanvasNode,
} from '@emcanvas/renderer/types/renderer'

function normalizeNode(node: CanvasNode): NormalizedCanvasNode {
  return {
    ...node,
    props: { ...node.props },
    styles: {
      desktop: { ...node.styles.desktop },
      ...(node.styles.tablet ? { tablet: { ...node.styles.tablet } } : {}),
      ...(node.styles.mobile ? { mobile: { ...node.styles.mobile } } : {}),
    },
    children: (node.children ?? []).map(normalizeNode),
  }
}

export function normalizeCanvasDocument(value: unknown): NormalizedCanvasDocument | null {
  if (!isCanvasDocument(value)) {
    return null
  }

  return {
    ...value,
    settings: { ...value.settings },
    root: normalizeNode(value.root),
  }
}
