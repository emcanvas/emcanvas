import type { CanvasNode } from '@emcanvas/foundation/types/canvas'
import type {
  NormalizedCanvasDocument,
  NormalizedCanvasNode,
} from '@emcanvas/renderer/types/renderer'
import { parseCanvasDocument } from './canvas-document-schema'

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
  const result = parseCanvasDocument(value)

  if (!result.success) {
    return null
  }

  return {
    ...result.data,
    settings: cloneJsonValue(result.data.settings),
    root: normalizeNode(result.data.root),
  }
}
