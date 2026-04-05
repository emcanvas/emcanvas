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

export interface GenericLeafRenderModel {
  attributes?: Record<string, string | true>
  isVoid?: true
  textContent?: string
}

export type LeafRenderModel =
  | ({ category: 'leaf'; kind: 'heading'; tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' } & GenericLeafRenderModel)
  | ({ category: 'leaf'; kind: 'text'; tag: 'p' } & GenericLeafRenderModel)
  | ({ category: 'leaf'; kind: 'button'; tag: 'a' } & GenericLeafRenderModel)
  | ({ category: 'leaf'; kind: 'spacer'; tag: 'div' } & GenericLeafRenderModel)
  | ({ category: 'leaf'; kind: 'divider'; tag: 'hr' } & GenericLeafRenderModel)
  | ({ category: 'leaf'; kind: 'image'; tag: 'img' } & GenericLeafRenderModel)
  | ({ category: 'leaf'; kind: 'video'; tag: 'video' } & GenericLeafRenderModel)

export type CanvasNodeRenderModel = WrapperRenderModel | LeafRenderModel

export type CanvasNodeRenderer = (node: NormalizedCanvasNode) => CanvasNodeRenderModel
