import type { CanvasNodeRenderer } from '../types/renderer'
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

export function registerRenderer(type: string, renderer: CanvasNodeRenderer): () => void {
  if (type in renderers) {
    throw new Error(`Renderer already registered for type: ${type}`)
  }

  renderers[type] = renderer

  return () => {
    delete renderers[type]
  }
}

export function getComponentRenderer(type: string): CanvasNodeRenderer {
  const renderer = renderers[type]

  if (!renderer) {
    throw new Error(`Unsupported canvas node type: ${type}`)
  }

  return renderer
}
