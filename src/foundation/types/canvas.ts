import { CANVAS_DOCUMENT_VERSION } from '../shared/constants'

export interface ResponsiveStyles {
  desktop: Record<string, unknown>
  tablet?: Record<string, unknown>
  mobile?: Record<string, unknown>
}

export interface BaseWidgetProps {
  spacing?: Record<string, unknown>
  size?: Record<string, unknown>
  visibility?: Record<string, unknown>
  cssId?: string
  cssClasses?: string[]
}

export interface CanvasNode {
  id: string
  type: string
  props: Record<string, unknown>
  advancedProps?: BaseWidgetProps
  styles: ResponsiveStyles
  children?: CanvasNode[]
}

export interface CanvasDocument {
  version: typeof CANVAS_DOCUMENT_VERSION
  root: CanvasNode
  settings: Record<string, unknown>
}
