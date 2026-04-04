import { CANVAS_DOCUMENT_VERSION } from '../../src/foundation/shared/constants'
import type { CanvasDocument, CanvasNode } from '../../src/foundation/types/canvas'

export function createFixtureDocument(): CanvasDocument {
  return {
    version: CANVAS_DOCUMENT_VERSION,
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    },
    settings: {},
  }
}

export function createFixtureHeadingNode(text = 'Welcome'): CanvasNode {
  return {
    id: 'heading-1',
    type: 'heading',
    props: {
      text,
      level: 2,
    },
    styles: { desktop: {} },
    children: [],
  }
}
