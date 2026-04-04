import { describe, expect, it } from 'vitest'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
import { saveCanvasData } from '../../../src/plugin/routes/save-canvas-data'

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
    const _emcanvas = {
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
      payload: { canvasLayout, _emcanvas },
    })

    expect(result).toEqual({
      slug: 'home',
      title: 'Homepage',
      [EMCANVAS_LAYOUT_KEY]: canvasLayout,
      [EMCANVAS_ENTRY_META_KEY]: _emcanvas,
    })
    expect(entry.data).toEqual(result)
  })

  it('rejects an invalid canvas document payload', async () => {
    await expect(
      saveCanvasData({
        entry: { data: {} },
        payload: {
          canvasLayout: { version: 999 },
          _emcanvas: {
            enabled: true,
            version: CANVAS_DOCUMENT_VERSION,
            editorVersion: EMCANVAS_EDITOR_VERSION,
          },
        },
      }),
    ).rejects.toThrow('Invalid canvas payload')
  })

  it('does not mutate entry data when validation fails', async () => {
    const entry = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }

    await expect(
      saveCanvasData({
        entry,
        payload: {
          canvasLayout: { version: 999 },
          _emcanvas: {
            enabled: true,
            version: CANVAS_DOCUMENT_VERSION,
            editorVersion: EMCANVAS_EDITOR_VERSION,
          },
        },
      }),
    ).rejects.toThrow('Invalid canvas payload')

    expect(entry.data).toEqual({
      slug: 'home',
      title: 'Homepage',
    })
  })

  it('rejects invalid _emcanvas metadata payloads', async () => {
    await expect(
      saveCanvasData({
        entry: { data: {} },
        payload: {
          canvasLayout: {
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
          _emcanvas: {
            enabled: true,
            version: '1',
            editorVersion: EMCANVAS_EDITOR_VERSION,
          } as unknown as never,
        },
      }),
    ).rejects.toThrow('Invalid canvas payload')
  })
})
