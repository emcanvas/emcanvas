import type { CanvasDocument, CanvasNode, ResponsiveStyles } from '../types/canvas'

export const DEFAULT_NODE_TYPE = 'section'

export function createDefaultResponsiveStyles(): ResponsiveStyles {
  return { desktop: {} }
}

export function createDefaultNodeBase(): Omit<CanvasNode, 'id'> {
  return {
    type: DEFAULT_NODE_TYPE,
    props: {},
    styles: createDefaultResponsiveStyles(),
    children: [],
  }
}

export function createDefaultDocumentSettings(): CanvasDocument['settings'] {
  return {}
}
