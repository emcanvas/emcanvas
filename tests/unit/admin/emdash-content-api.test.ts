import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  emdashContentApi,
  canUseEmDashContentApi,
} from '../../../src/admin/lib/emdash-content-api'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../../src/foundation/shared/constants'

const persistedCanvasLayout = {
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

afterEach(() => {
  vi.restoreAllMocks()
})

describe('emdashContentApi', () => {
  it('detects when the browser entry can use the real EmDash content API', () => {
    window.history.replaceState(
      {},
      '',
      '/_emdash/admin/plugins/emcanvas/editor?id=page-1',
    )

    expect(canUseEmDashContentApi({ data: { id: 'page-1' } })).toBe(true)
    expect(canUseEmDashContentApi({ data: { slug: 'home' } })).toBe(false)
  })

  it('loads the persisted canvas document from the EmDash pages API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          item: {
            id: 'page-1',
            type: 'pages',
            data: {
              slug: 'home',
              canvasLayout: persistedCanvasLayout,
              _emcanvas: {
                enabled: true,
                version: CANVAS_DOCUMENT_VERSION,
                editorVersion: EMCANVAS_EDITOR_VERSION,
              },
            },
          },
          _rev: 'rev-1',
        },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      emdashContentApi.loadDocument({ entry: { data: { id: 'page-1' } } }),
    ).resolves.toEqual({
      canvasLayout: persistedCanvasLayout,
      _emcanvas: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/_emdash/api/content/pages/page-1',
      {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      },
    )
  })

  it('updates and publishes the real EmDash page entry through the content API', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            item: {
              id: 'page-1',
              type: 'pages',
              data: {
                slug: 'home',
                title: 'Homepage',
                content: [{ _type: 'block', children: [] }],
              },
            },
            _rev: 'rev-1',
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { item: { id: 'page-1' } } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { item: { id: 'page-1' } } }),
      })
    vi.stubGlobal('fetch', fetchMock)

    const payload = {
      slug: 'home',
      title: 'Homepage',
      canvasLayout: persistedCanvasLayout,
      _emcanvas: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
    }

    await expect(
      emdashContentApi.saveDocument({
        entry: { data: { id: 'page-1' } },
        payload,
      }),
    ).resolves.toEqual({
      slug: 'home',
      title: 'Homepage',
      content: [{ _type: 'block', children: [] }],
      canvasLayout: persistedCanvasLayout,
      _emcanvas: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
    })

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/_emdash/api/content/pages/page-1',
      {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      },
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/_emdash/api/content/pages/page-1',
      {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            slug: 'home',
            title: 'Homepage',
            content: [{ _type: 'block', children: [] }],
            canvasLayout: persistedCanvasLayout,
            _emcanvas: {
              enabled: true,
              version: CANVAS_DOCUMENT_VERSION,
              editorVersion: EMCANVAS_EDITOR_VERSION,
            },
          },
          _rev: 'rev-1',
        }),
      },
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/_emdash/api/content/pages/page-1/publish',
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      },
    )
  })
})
