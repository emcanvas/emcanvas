import { describe, expect, it } from 'vitest'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
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
})
