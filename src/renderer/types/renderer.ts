import type { CanvasDocument, CanvasNode } from '../../foundation/types/canvas'

export interface NormalizedCanvasNode extends Omit<CanvasNode, 'children'> {
  children: NormalizedCanvasNode[]
}

export interface NormalizedCanvasDocument extends Omit<CanvasDocument, 'root'> {
  root: NormalizedCanvasNode
}

export interface CanvasEntryState {
  shouldRender: boolean
  document: NormalizedCanvasDocument | null
}

export interface SerializedResponsiveStyles {
  inlineStyle: string
  mediaRules: string[]
}
