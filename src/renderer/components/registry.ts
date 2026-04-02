import type { NormalizedCanvasNode } from '../types/renderer'
import { renderButtonNode } from './renderers/button'
import { renderColumnsNode } from './renderers/columns'
import { renderContainerNode } from './renderers/container'
import { renderDividerNode } from './renderers/divider'
import { renderHeadingNode } from './renderers/heading'
import { renderImageNode } from './renderers/image'
import { renderSectionNode } from './renderers/section'
import { renderSpacerNode } from './renderers/spacer'
import { renderTextNode } from './renderers/text'
import { renderVideoNode } from './renderers/video'

export type CanvasNodeRenderModel =
  | { kind: 'section' }
  | { kind: 'columns' }
  | { kind: 'container' }
  | { kind: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { kind: 'text'; text: string }
  | { kind: 'button'; href: string; label: string }
  | { kind: 'spacer' }
  | { kind: 'divider' }
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string }

export type CanvasNodeRenderer = (node: NormalizedCanvasNode) => CanvasNodeRenderModel

const renderers: Record<string, CanvasNodeRenderer> = {
  section: renderSectionNode,
  columns: renderColumnsNode,
  container: renderContainerNode,
  heading: renderHeadingNode,
  text: renderTextNode,
  button: renderButtonNode,
  spacer: renderSpacerNode,
  divider: renderDividerNode,
  image: renderImageNode,
  video: renderVideoNode,
}

export function getComponentRenderer(type: string): CanvasNodeRenderer {
  return renderers[type] ?? renderContainerNode
}
