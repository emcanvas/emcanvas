import { describe, expect, it } from 'vitest'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
import { saveCanvasData } from '../../../src/plugin/routes/save-canvas-data'
import plugin from '../../../src/plugin/manifest'

describe('saveCanvasData', () => {
  it('merges canvas data into the existing entry data', async () => {
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
    const meta = {
      enabled: true,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    }
    const entry = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }

    const result = await saveCanvasData({
      entry,
      payload: { canvasLayout, meta },
    })

    expect(result).toEqual({
      slug: 'home',
      title: 'Homepage',
      [EMCANVAS_LAYOUT_KEY]: canvasLayout,
      [EMCANVAS_ENTRY_META_KEY]: meta,
    })
    expect(entry.data).toEqual(result)
  })

  it('rejects an invalid canvas document payload', async () => {
    await expect(
      saveCanvasData({
        entry: { data: {} },
        payload: {
          canvasLayout: { version: 999 },
          meta: {
            enabled: true,
            version: CANVAS_DOCUMENT_VERSION,
            editorVersion: EMCANVAS_EDITOR_VERSION,
          },
        },
      }),
    ).rejects.toThrow('Invalid canvas payload')
  })
})

describe('plugin manifest routes', () => {
  it('exposes the canvas data route handlers', () => {
    expect(plugin.routes).toMatchObject({
      getCanvasData: expect.any(Function),
      saveCanvasData: expect.any(Function),
    })
  })
})
