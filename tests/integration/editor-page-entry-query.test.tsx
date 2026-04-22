import { cleanup, render, screen, waitFor } from '@testing-library/react'
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
  it('stabilizes the location-derived entry after the initial document load', async () => {
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

    await waitFor(() => {
      expect(screen.queryByText('Loading canvas…')).not.toBeInTheDocument()
    })

    expect(api.loadDocument).toHaveBeenCalledTimes(1)
  })

  it('hydrates the editor entry from the deep-link query string with entry id when present', async () => {
    window.history.replaceState(
      {},
      '',
      '/_emdash/admin/plugins/emcanvas/editor?id=entry-123&slug=home&title=Homepage',
    )

    const entry = { data: { id: 'entry-123', slug: 'home', title: 'Homepage' } }
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

  it('prefers the explicit entry prop over the location fallback', async () => {
    window.history.replaceState(
      {},
      '',
      '/_emdash/admin/plugins/emcanvas/editor?id=query-entry&slug=query-home&title=Query Homepage',
    )

    const entry = {
      data: { id: 'prop-entry', slug: 'prop-home', title: 'Prop Homepage' },
    }
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
        .mockReturnValue('/preview?slug=prop-home&source=emcanvas'),
    }

    render(<EditorPage entry={entry} api={api} />)

    await waitFor(() => {
      expect(api.loadDocument).toHaveBeenCalledWith(entry)
    })

    expect(api.loadDocument).toHaveBeenCalledTimes(1)
    expect(api.getPreviewLink).toHaveBeenCalledWith({
      entry,
      origin: undefined,
    })
  })
})
