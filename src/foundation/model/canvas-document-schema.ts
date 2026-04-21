import { CANVAS_DOCUMENT_VERSION } from '../shared/constants'
import { normalizeButtonHref } from '../shared/button-href'
import type { CanvasDocument, CanvasNode } from '../types/canvas'

export interface CanvasDocumentParseSuccess {
  success: true
  data: CanvasDocument
}

export interface CanvasDocumentParseFailure {
  success: false
  errors: string[]
}

export type CanvasDocumentParseResult =
  | CanvasDocumentParseSuccess
  | CanvasDocumentParseFailure

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

  if (typeof value !== 'object') {
    return false
  }

  if (visited.has(value)) {
    return false
  }

  visited.add(value)

  if (Array.isArray(value)) {
    return value.every((entry) => isJsonValue(entry, visited))
  }

  if (!isRecord(value)) {
    return false
  }

  return Object.values(value).every((entry) => isJsonValue(entry, visited))
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && isJsonValue(value, new WeakSet<object>())
}

function isCanvasNodeAdvancedProps(value: unknown): boolean {
  if (!isRecord(value)) {
    return false
  }

  const validKeys = new Set([
    'spacing',
    'size',
    'visibility',
    'cssId',
    'cssClasses',
  ])

  if (Object.keys(value).some((key) => !validKeys.has(key))) {
    return false
  }

  if (
    'spacing' in value &&
    value.spacing !== undefined &&
    !isJsonRecord(value.spacing)
  ) {
    return false
  }

  if (
    'size' in value &&
    value.size !== undefined &&
    !isJsonRecord(value.size)
  ) {
    return false
  }

  if (
    'visibility' in value &&
    value.visibility !== undefined &&
    !isJsonRecord(value.visibility)
  ) {
    return false
  }

  if (
    'cssId' in value &&
    value.cssId !== undefined &&
    typeof value.cssId !== 'string'
  ) {
    return false
  }

  if (
    'cssClasses' in value &&
    value.cssClasses !== undefined &&
    (!Array.isArray(value.cssClasses) ||
      value.cssClasses.some((entry) => typeof entry !== 'string'))
  ) {
    return false
  }

  return true
}

function isCanvasNode(
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

  if (
    !isJsonRecord(value.props) ||
    ('advancedProps' in value &&
      value.advancedProps !== undefined &&
      !isCanvasNodeAdvancedProps(value.advancedProps)) ||
    !isRecord(value.styles) ||
    !isJsonRecord(value.styles.desktop)
  ) {
    return false
  }

  if (
    'tablet' in value.styles &&
    value.styles.tablet !== undefined &&
    !isJsonRecord(value.styles.tablet)
  ) {
    return false
  }

  if (
    'mobile' in value.styles &&
    value.styles.mobile !== undefined &&
    !isJsonRecord(value.styles.mobile)
  ) {
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

export function parseCanvasDocument(value: unknown): CanvasDocumentParseResult {
  if (!isRecord(value)) {
    return {
      success: false,
      errors: ['Canvas document must be an object.'],
    }
  }

  if (value.version !== CANVAS_DOCUMENT_VERSION) {
    return {
      success: false,
      errors: [`Canvas document must use version ${CANVAS_DOCUMENT_VERSION}.`],
    }
  }

  if (!isCanvasNode(value.root, new WeakSet<object>())) {
    return {
      success: false,
      errors: [
        'Canvas document must include a valid root node with JSON-safe props and styles.',
      ],
    }
  }

  if (!isJsonRecord(value.settings)) {
    return {
      success: false,
      errors: ['Canvas document settings must be a JSON-safe object.'],
    }
  }

  return {
    success: true,
    data: normalizeCanvasDocument({
      version: value.version,
      root: value.root,
      settings: value.settings,
    }),
  }
}

function normalizeCanvasDocument(document: CanvasDocument): CanvasDocument {
  return {
    ...document,
    settings: { ...document.settings },
    root: normalizeCanvasNode(document.root),
  }
}

function normalizeCanvasNode(node: CanvasNode): CanvasNode {
  return {
    ...node,
    props:
      node.type === 'button'
        ? {
            ...node.props,
            href: normalizeButtonHref(node.props.href),
          }
        : { ...node.props },
    advancedProps:
      node.advancedProps === undefined
        ? undefined
        : {
            ...node.advancedProps,
            spacing:
              node.advancedProps.spacing === undefined
                ? undefined
                : { ...node.advancedProps.spacing },
            size:
              node.advancedProps.size === undefined
                ? undefined
                : { ...node.advancedProps.size },
            visibility:
              node.advancedProps.visibility === undefined
                ? undefined
                : { ...node.advancedProps.visibility },
            cssClasses:
              node.advancedProps.cssClasses === undefined
                ? undefined
                : [...node.advancedProps.cssClasses],
          },
    styles: {
      desktop: { ...node.styles.desktop },
      ...(node.styles.tablet === undefined
        ? {}
        : { tablet: { ...node.styles.tablet } }),
      ...(node.styles.mobile === undefined
        ? {}
        : { mobile: { ...node.styles.mobile } }),
    },
    children: node.children?.map(normalizeCanvasNode),
  }
}
