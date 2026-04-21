import { describe, expect, it } from 'vitest'

import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../../src/foundation/types/canvas'
import {
  getDefaultCanvasDocumentState,
  loadCanvasDocumentState,
  serializeCanvasDocumentToEntryData,
} from '../../../src/shared/persistence/canvas-document-entry'

function createDocument(): CanvasDocument {
  return {
    version: CANVAS_DOCUMENT_VERSION,
    settings: {},
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    },
  }
}

describe('canvas-document-entry helpers', () => {
  it('loads persisted canvas state from entry data', () => {
    const canvasLayout = createDocument()
    const _emcanvas = {
      enabled: true,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    }

    expect(
      loadCanvasDocumentState({
        slug: 'home',
        [EMCANVAS_LAYOUT_KEY]: canvasLayout,
        [EMCANVAS_ENTRY_META_KEY]: _emcanvas,
      }),
    ).toEqual({ canvasLayout, _emcanvas })
  })

  it('falls back to the default document state when entry data is missing or invalid', () => {
    const fallback = getDefaultCanvasDocumentState()

    expect(loadCanvasDocumentState({})).toMatchObject({
      _emcanvas: fallback._emcanvas,
      canvasLayout: {
        version: CANVAS_DOCUMENT_VERSION,
        settings: {},
        root: {
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
      },
    })

    expect(
      loadCanvasDocumentState({
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
        [EMCANVAS_ENTRY_META_KEY]: {
          enabled: 'yes',
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      }),
    ).toMatchObject({
      _emcanvas: fallback._emcanvas,
      canvasLayout: {
        version: CANVAS_DOCUMENT_VERSION,
        settings: {},
        root: {
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
      },
    })
  })

  it('serializes canvas state back into entry data with enabled metadata by default', () => {
    const canvasLayout = createDocument()

    expect(
      serializeCanvasDocumentToEntryData({
        entryData: { slug: 'home', title: 'Homepage' },
        canvasLayout,
      }),
    ).toEqual({
      slug: 'home',
      title: 'Homepage',
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: canvasLayout,
    })
  })

  it('supports a validated metadata override during serialization', () => {
    const canvasLayout = createDocument()
    const _emcanvas = {
      enabled: false,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    }

    expect(
      serializeCanvasDocumentToEntryData({
        entryData: { slug: 'home' },
        canvasLayout,
        _emcanvas,
      }),
    ).toEqual({
      slug: 'home',
      [EMCANVAS_ENTRY_META_KEY]: _emcanvas,
      [EMCANVAS_LAYOUT_KEY]: canvasLayout,
    })
  })

  it('normalizes invalid button hrefs to a safe fallback during load and serialization', () => {
    const buttonDocument: CanvasDocument = {
      version: CANVAS_DOCUMENT_VERSION,
      settings: {},
      root: {
        id: 'root',
        type: 'section',
        props: {},
        styles: { desktop: {} },
        children: [
          {
            id: 'button-1',
            type: 'button',
            props: {
              label: 'Read more',
              href: 'javascript:alert(1)',
            },
            styles: { desktop: {} },
            children: [],
          },
        ],
      },
    }

    const loadedState = loadCanvasDocumentState({
      [EMCANVAS_LAYOUT_KEY]: buttonDocument,
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
    })

    expect(loadedState.canvasLayout.root.children?.[0]?.props.href).toBe('#')

    const serialized = serializeCanvasDocumentToEntryData({
      entryData: {},
      canvasLayout: buttonDocument,
    })

    expect(serialized.canvasLayout.root.children?.[0]?.props.href).toBe('#')
  })

  it('rejects invalid canvas documents and metadata during serialization', () => {
    expect(() =>
      serializeCanvasDocumentToEntryData({
        entryData: {},
        canvasLayout: {
          version: CANVAS_DOCUMENT_VERSION,
          settings: {},
          root: {
            id: 'root',
            type: 'section',
            props: {
              onClick: () => 'boom',
            },
            styles: { desktop: {} },
            children: [],
          },
        } as unknown as CanvasDocument,
      }),
    ).toThrow('Invalid canvas payload')

    expect(() =>
      serializeCanvasDocumentToEntryData({
        entryData: {},
        canvasLayout: createDocument(),
        _emcanvas: {
          enabled: true,
          version: '1',
          editorVersion: EMCANVAS_EDITOR_VERSION,
        } as never,
      }),
    ).toThrow('Invalid canvas payload')
  })
})
