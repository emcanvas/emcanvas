import { describe, expect, it } from 'vitest'

import { CANVAS_DOCUMENT_VERSION } from '../../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../../src/foundation/types/canvas'
import { normalizeCanvasDocument } from '../../../src/renderer/data/normalize-canvas-document'

function createDocument(): CanvasDocument {
  return {
    version: CANVAS_DOCUMENT_VERSION,
    settings: { theme: 'dark' },
    root: {
      id: 'root',
      type: 'section',
      props: {
        content: {
          title: 'Hero',
        },
      },
      styles: {
        desktop: { color: 'red' },
        tablet: { width: '80%' },
      },
      children: [
        {
          id: 'heading-1',
          type: 'heading',
          props: { text: 'Welcome', level: 2 },
          styles: { desktop: { color: 'blue' } },
          children: [],
        },
      ],
    },
  }
}

describe('normalizeCanvasDocument', () => {
  it('returns null when the value is not a valid canvas document', () => {
    expect(normalizeCanvasDocument({ version: CANVAS_DOCUMENT_VERSION })).toBeNull()
  })

  it('returns a normalized clone with detached settings, nodes, styles, and nested props', () => {
    const document = createDocument()

    const result = normalizeCanvasDocument(document)

    expect(result).not.toBeNull()
    expect(result).toEqual({
      version: CANVAS_DOCUMENT_VERSION,
      settings: { theme: 'dark' },
      root: {
        id: 'root',
        type: 'section',
        props: {
          content: {
            title: 'Hero',
          },
        },
        styles: {
          desktop: { color: 'red' },
          tablet: { width: '80%' },
        },
        children: [
          {
            id: 'heading-1',
            type: 'heading',
            props: { text: 'Welcome', level: 2 },
            styles: { desktop: { color: 'blue' } },
            children: [],
          },
        ],
      },
    })

    expect(result).not.toBe(document)
    expect(result?.settings).not.toBe(document.settings)
    expect(result?.root).not.toBe(document.root)
    expect(result?.root.styles).not.toBe(document.root.styles)
    expect(result?.root.styles.desktop).not.toBe(document.root.styles.desktop)
    expect(result?.root.children).not.toBe(document.root.children)
    expect(result?.root.children[0]).not.toBe(document.root.children?.[0])
    expect(result?.root.props).not.toBe(document.root.props)
    expect(result?.root.props.content).not.toBe(document.root.props.content)

    const normalizedContent = result?.root.props.content as { title: string }
    normalizedContent.title = 'Changed'

    expect((document.root.props.content as { title: string }).title).toBe('Hero')
  })
})
