import { describe, expect, it } from 'vitest'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
import { isCanvasDocument } from '../../../src/foundation/model/guards'
import { getCanvasData } from '../../../src/plugin/routes/get-canvas-data'

describe('getCanvasData', () => {
  it('returns defaults when canvas data is missing', async () => {
    const result = await getCanvasData({ entry: { data: {} } })

    expect(result.canvasLayout.version).toBe(CANVAS_DOCUMENT_VERSION)
    expect(result._emcanvas).toEqual({
      enabled: false,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    })
  })

  it('returns a default document when canvasLayout is empty', async () => {
    const result = await getCanvasData({
      entry: {
        data: {
          [EMCANVAS_LAYOUT_KEY]: '',
        },
      },
    })

    expect(isCanvasDocument(result.canvasLayout)).toBe(true)
    expect(result.canvasLayout.version).toBe(CANVAS_DOCUMENT_VERSION)
    expect(result.canvasLayout.root.props).toEqual({})
  })

  it('returns persisted canvas data when present', async () => {
    const canvasLayout = {
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
    const _emcanvas = {
      enabled: true,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    }

    const result = await getCanvasData({
      entry: {
        data: {
          [EMCANVAS_LAYOUT_KEY]: canvasLayout,
          [EMCANVAS_ENTRY_META_KEY]: _emcanvas,
        },
      },
    })

    expect(result).toEqual({ canvasLayout, _emcanvas })
  })

  it('falls back to default metadata when persisted _emcanvas is invalid', async () => {
    const result = await getCanvasData({
      entry: {
        data: {
          [EMCANVAS_ENTRY_META_KEY]: {
            enabled: 'yes',
            version: CANVAS_DOCUMENT_VERSION,
            editorVersion: EMCANVAS_EDITOR_VERSION,
          },
        },
      },
    })

    expect(result._emcanvas).toEqual({
      enabled: false,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    })
  })

  it('falls back to a default document when persisted canvasLayout is invalid', async () => {
    const result = await getCanvasData({
      entry: {
        data: {
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
        },
      },
    })

    expect(isCanvasDocument(result.canvasLayout)).toBe(true)
    expect(result.canvasLayout.version).toBe(CANVAS_DOCUMENT_VERSION)
    expect(result.canvasLayout.root.children).toEqual([])
  })

  it('falls back to a default document when persisted canvasLayout contains non-json values', async () => {
    const result = await getCanvasData({
      entry: {
        data: {
          [EMCANVAS_LAYOUT_KEY]: {
            version: CANVAS_DOCUMENT_VERSION,
            root: {
              id: 'root',
              type: 'section',
              props: {
                onClick: () => 'boom',
              },
              styles: { desktop: {} },
              children: [],
            },
            settings: {},
          },
        },
      },
    })

    expect(isCanvasDocument(result.canvasLayout)).toBe(true)
    expect(result.canvasLayout.root.id).not.toBe('root')
    expect(result.canvasLayout.root.props).toEqual({})
  })
})
