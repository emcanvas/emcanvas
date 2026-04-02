import { CANVAS_DOCUMENT_VERSION } from '../shared/constants'

export interface ResponsiveStyles {
  desktop: Record<string, unknown>
  tablet?: Record<string, unknown>
  mobile?: Record<string, unknown>
}

export interface CanvasNode {
  id: string
  type: string
  props: Record<string, unknown>
  styles: ResponsiveStyles
  children?: CanvasNode[]
}

export interface CanvasDocument {
  version: typeof CANVAS_DOCUMENT_VERSION
  root: CanvasNode
  settings: Record<string, unknown>
}
