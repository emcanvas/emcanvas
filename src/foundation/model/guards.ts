import { CANVAS_DOCUMENT_VERSION } from '../shared/constants'
import type {
  CanvasDocument,
  CanvasNode,
  ResponsiveStyles,
} from '../types/canvas'
import type { EmCanvasEntryMeta } from '../types/entry-data'
import { parseCanvasDocument } from './canvas-document-schema'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isResponsiveStyles(value: unknown): value is ResponsiveStyles {
  if (!isRecord(value) || !isRecord(value.desktop)) {
    return false
  }

  if (
    'tablet' in value &&
    value.tablet !== undefined &&
    !isRecord(value.tablet)
  ) {
    return false
  }

  if (
    'mobile' in value &&
    value.mobile !== undefined &&
    !isRecord(value.mobile)
  ) {
    return false
  }

  return true
}

export function isCanvasNode(value: unknown): value is CanvasNode {
  return isCanvasNodeInternal(value, new WeakSet<object>())
}

function isCanvasNodeInternal(
  value: unknown,
  visited: WeakSet<object>,
): value is CanvasNode {
  if (!isRecord(value)) {
    return false
  }

  if (visited.has(value)) {
    return false
  }

  visited.add(value)

  if (typeof value.id !== 'string' || typeof value.type !== 'string') {
    return false
  }

  if (!isRecord(value.props) || !isResponsiveStyles(value.styles)) {
    return false
  }

  if ('children' in value && value.children !== undefined) {
    if (!Array.isArray(value.children)) {
      return false
    }

    return value.children.every((child) => isCanvasNodeInternal(child, visited))
  }

  return true
}

export function isCanvasDocument(value: unknown): value is CanvasDocument {
  return parseCanvasDocument(value).success
}

export function isEmCanvasEntryMeta(
  value: unknown,
): value is EmCanvasEntryMeta {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.enabled === 'boolean' &&
    value.version === CANVAS_DOCUMENT_VERSION &&
    typeof value.editorVersion === 'string'
  )
}
