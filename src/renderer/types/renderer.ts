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

export type WrapperRenderModel =
  | { category: 'wrapper'; kind: 'section'; tag: 'section' }
  | { category: 'wrapper'; kind: 'columns'; tag: 'div' }
  | { category: 'wrapper'; kind: 'container'; tag: 'div' }

export type LeafRenderModel =
  | { category: 'leaf'; kind: 'heading'; tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; text: string }
  | { category: 'leaf'; kind: 'text'; tag: 'p'; text: string }
  | { category: 'leaf'; kind: 'button'; tag: 'a'; href: string; label: string }
  | { category: 'leaf'; kind: 'spacer'; tag: 'div' }
  | { category: 'leaf'; kind: 'divider'; tag: 'hr' }
  | { category: 'leaf'; kind: 'image'; tag: 'img'; src: string; alt: string }
  | { category: 'leaf'; kind: 'video'; tag: 'video'; src: string }

export type CanvasNodeRenderModel = WrapperRenderModel | LeafRenderModel

export type CanvasNodeRenderer = (node: NormalizedCanvasNode) => CanvasNodeRenderModel
