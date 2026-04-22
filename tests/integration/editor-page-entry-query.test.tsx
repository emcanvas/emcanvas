import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EditorPage } from '../../src/plugin/pages/editor-page'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../src/foundation/shared/constants'

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

describe('plugin editor page entry query fallback', () => {
  it('hydrates the editor entry from the deep-link query string', async () => {
    window.history.replaceState(
      {},
      '',
      '/_emdash/admin/plugins/emcanvas/editor?slug=home&title=Homepage',
    )

    const entry = { data: { slug: 'home', title: 'Homepage' } }
    const api = {
      loadDocument: vi.fn().mockResolvedValue({
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
          enabled: false,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      }),
      saveDocument: vi.fn().mockResolvedValue({}),
      getPreviewLink: vi
        .fn()
        .mockReturnValue('/preview?slug=home&source=emcanvas'),
    }

    render(<EditorPage api={api} />)

    await waitFor(() => {
      expect(api.loadDocument).toHaveBeenCalledWith(entry)
    })

    expect(api.getPreviewLink).toHaveBeenCalledWith({
      entry,
      origin: undefined,
    })
  })
})
