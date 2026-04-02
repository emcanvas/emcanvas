import { describe, expect, it } from 'vitest'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
import { getCanvasEntryState } from '../../../src/renderer/data/get-canvas-entry-state'

describe('getCanvasEntryState', () => {
  it('returns a renderable normalized document when emcanvas is enabled', () => {
    const state = getCanvasEntryState({
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: { color: 'red' }, tablet: { width: '80%' } },
        },
        settings: {},
      },
    })

    expect(state.shouldRender).toBe(true)
    expect(state.document).toEqual({
      version: CANVAS_DOCUMENT_VERSION,
      root: {
        id: 'root',
        type: 'section',
        props: {},
        styles: { desktop: { color: 'red' }, tablet: { width: '80%' } },
        children: [],
      },
      settings: {},
    })
  })

  it('does not expose a document when the layout payload is invalid', () => {
    const state = getCanvasEntryState({
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: 'invalid',
        },
        settings: {},
      },
    })

    expect(state.shouldRender).toBe(true)
    expect(state.document).toBeNull()
  })

  it('does not render when emcanvas metadata is disabled', () => {
    const state = getCanvasEntryState({
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: false,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
        settings: {},
      },
    })

    expect(state.shouldRender).toBe(false)
    expect(state.document?.root.id).toBe('root')
  })
})
