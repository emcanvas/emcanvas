import { CANVAS_DOCUMENT_VERSION } from '../../foundation/shared/constants'
import type { CanvasDocument, CanvasNode } from '../../foundation/types/canvas'

interface ParseSuccess<T> {
  success: true
  data: T
}

interface ParseFailure {
  success: false
}

type ParseResult<T> = ParseSuccess<T> | ParseFailure

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isJsonValue(value: unknown, visited: WeakSet<object>): boolean {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true
  }

  if (Array.isArray(value)) {
    return value.every((entry) => isJsonValue(entry, visited))
  }

  if (!isRecord(value)) {
    return false
  }

  if (visited.has(value)) {
    return false
  }

  visited.add(value)

  return Object.values(value).every((entry) => isJsonValue(entry, visited))
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && isJsonValue(value, new WeakSet<object>())
}

function isCanvasNode(value: unknown, visited: WeakSet<object>): value is CanvasNode {
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

  if (!isJsonRecord(value.props) || !isRecord(value.styles) || !isJsonRecord(value.styles.desktop)) {
    return false
  }

  if ('tablet' in value.styles && value.styles.tablet !== undefined && !isJsonRecord(value.styles.tablet)) {
    return false
  }

  if ('mobile' in value.styles && value.styles.mobile !== undefined && !isJsonRecord(value.styles.mobile)) {
    return false
  }

  if ('children' in value && value.children !== undefined) {
    if (!Array.isArray(value.children)) {
      return false
    }

    return value.children.every((child) => isCanvasNode(child, visited))
  }

  return true
}

const canvasDocumentSchema = {
  safeParse(value: unknown): ParseResult<CanvasDocument> {
    if (!isRecord(value)) {
      return { success: false }
    }

    if (
      value.version !== CANVAS_DOCUMENT_VERSION ||
      !isCanvasNode(value.root, new WeakSet<object>()) ||
      !isJsonRecord(value.settings)
    ) {
      return { success: false }
    }

    return {
      success: true,
      data: value as unknown as CanvasDocument,
    }
  },
}

export function parseCanvasDocument(value: unknown): ParseResult<CanvasDocument> {
  return canvasDocumentSchema.safeParse(value)
}
