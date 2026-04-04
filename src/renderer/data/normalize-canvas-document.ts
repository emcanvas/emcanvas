import { isCanvasDocument } from '@emcanvas/foundation/model/guards'
import type { CanvasNode } from '@emcanvas/foundation/types/canvas'
import type {
  NormalizedCanvasDocument,
  NormalizedCanvasNode,
} from '@emcanvas/renderer/types/renderer'

function cloneJsonValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneJsonValue(item)) as T
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, cloneJsonValue(entryValue)]),
    ) as T
  }

  return value
}

function normalizeNode(node: CanvasNode): NormalizedCanvasNode {
  return {
    ...node,
    props: cloneJsonValue(node.props),
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
    settings: cloneJsonValue(value.settings),
    root: normalizeNode(value.root),
  }
}
