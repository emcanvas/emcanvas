import { describe, expect, it } from 'vitest'

import { createDefaultCanvasDocument } from '../../src/foundation/model/document-factory'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../src/foundation/shared/constants'
import { pluginApi, type PluginApi } from '../../src/admin/lib/plugin-api'
import { routeAdapters } from '../../src/plugin/runtime/route-adapters'

describe('plugin api', () => {
  it('uses host-compatible route wrappers', async () => {
    const persistedCanvasLayout = createDefaultCanvasDocument()
    const entry = {
      data: {
        slug: 'home',
        canvasLayout: persistedCanvasLayout,
        _emcanvas: {
          enabled: true,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      },
    }
    const canvasLayout = createDefaultCanvasDocument()
    const api: PluginApi = pluginApi

    await expect(api.loadDocument(entry)).resolves.toEqual(
      await routeAdapters.loadDocument({ entry }),
    )

    await expect(api.saveDocument({ entry, canvasLayout })).resolves.toEqual(
      await routeAdapters.saveDocument({
        entry,
        payload: {
          ...entry.data,
          canvasLayout,
          _emcanvas: {
            enabled: true,
            version: CANVAS_DOCUMENT_VERSION,
            editorVersion: EMCANVAS_EDITOR_VERSION,
          },
        },
      }),
    )

    expect(api.getPreviewLink).toBe(routeAdapters.getPreviewLink)
  })
})
