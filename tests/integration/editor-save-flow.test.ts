import { afterEach, describe, expect, it, vi } from 'vitest'

import { createDefaultCanvasDocument } from '../../src/foundation/model/document-factory'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import { buildEntryPayload } from '../../src/editor/persistence/entry-payload'
import { loadDocumentWithPort } from '../../src/editor/persistence/load-document'
import type { PersistencePort } from '../../src/editor/persistence/persistence-port'
import { saveDocumentWithPort } from '../../src/editor/persistence/save-document'
import { createAutosaveController } from '../../src/editor/state/autosave-controller'
import { createEditorStore } from '../../src/editor/state/editor-store'
import type { CanvasEntry } from '../../src/shared/types/canvas-entry'

afterEach(() => {
  vi.useRealTimers()
})

describe('editor save flow', () => {
  it('lets editor persistence depend on an injected port instead of plugin runtime imports', async () => {
    const entry: CanvasEntry = {
      data: {
        slug: 'home',
      },
    }
    const canvasLayout = createDefaultCanvasDocument()
    const port: PersistencePort = {
      loadDocument: vi.fn<PersistencePort['loadDocument']>().mockResolvedValue({
        canvasLayout,
        _emcanvas: {
          enabled: true,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      }),
      saveDocument: vi.fn<PersistencePort['saveDocument']>().mockResolvedValue({
        ...entry.data,
      }),
      getPreviewLink: vi
        .fn<PersistencePort['getPreviewLink']>()
        .mockReturnValue(
          'https://example.test/preview?slug=home&source=emcanvas',
        ),
    }

    await expect(loadDocumentWithPort(entry, port)).resolves.toEqual({
      canvasLayout,
      _emcanvas: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
    })
    await expect(
      saveDocumentWithPort({ entry, canvasLayout }, port),
    ).resolves.toEqual({
      ...entry.data,
    })

    expect(port.loadDocument).toHaveBeenCalledWith({ entry })
    expect(port.saveDocument).toHaveBeenCalledWith({
      entry,
      payload: buildEntryPayload(entry.data, canvasLayout),
    })
  })

  it('preserves non-emcanvas entry data while writing canvas state', () => {
    const canvasLayout = createDefaultCanvasDocument()

    const payload = buildEntryPayload(
      { slug: 'home', title: 'Homepage' },
      canvasLayout,
    )

    expect(payload).toEqual({
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

  it('loads the persisted canvas document from entry data through an explicit port', async () => {
    const canvasLayout = createDefaultCanvasDocument()
    const meta = {
      enabled: true,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    }
    const entry: CanvasEntry = {
      data: {
        slug: 'home',
        [EMCANVAS_LAYOUT_KEY]: canvasLayout,
        [EMCANVAS_ENTRY_META_KEY]: meta,
      },
    }
    const port: PersistencePort = {
      loadDocument: vi.fn<PersistencePort['loadDocument']>().mockResolvedValue({
        canvasLayout,
        _emcanvas: meta,
      }),
      saveDocument: vi.fn<PersistencePort['saveDocument']>(),
      getPreviewLink: vi
        .fn<PersistencePort['getPreviewLink']>()
        .mockReturnValue(''),
    }

    await expect(loadDocumentWithPort(entry, port)).resolves.toEqual({
      canvasLayout,
      _emcanvas: meta,
    })
    expect(port.loadDocument).toHaveBeenCalledWith({ entry })
  })

  it('saves the current document back into entry data through an explicit port', async () => {
    const entry: CanvasEntry = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }
    const canvasLayout = createDefaultCanvasDocument()
    const result = {
      ...entry.data,
      canvasLayout,
      _emcanvas: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
    }
    const port: PersistencePort = {
      loadDocument: vi.fn<PersistencePort['loadDocument']>(),
      saveDocument: vi
        .fn<PersistencePort['saveDocument']>()
        .mockResolvedValue(result),
      getPreviewLink: vi
        .fn<PersistencePort['getPreviewLink']>()
        .mockReturnValue(''),
    }

    await expect(
      saveDocumentWithPort({ entry, canvasLayout }, port),
    ).resolves.toEqual(result)

    expect(port.saveDocument).toHaveBeenCalledWith({
      entry,
      payload: {
        slug: 'home',
        title: 'Homepage',
        canvasLayout,
        _emcanvas: {
          enabled: true,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      },
    })
  })

  it('autosaves dirty editor state after the debounce interval', async () => {
    vi.useFakeTimers()

    const store = createEditorStore<CanvasDocument>()
    const savedSnapshots: CanvasDocument[] = []
    let document = createDefaultCanvasDocument()

    const controller = createAutosaveController({
      delayMs: 250,
      store,
      getDocument: () => document,
      save: async (nextDocument) => {
        savedSnapshots.push(nextDocument)
      },
    })

    document = {
      ...document,
      settings: { slug: 'home' },
    }
    store.markDirty()

    await vi.advanceTimersByTimeAsync(249)
    expect(savedSnapshots).toEqual([])
    expect(store.getState().dirty).toBe(true)

    await vi.advanceTimersByTimeAsync(1)

    expect(savedSnapshots).toEqual([document])
    expect(store.getState().dirty).toBe(false)

    controller.dispose()
  })

  it('keeps newer edits dirty when an older in-flight save resolves later', async () => {
    vi.useFakeTimers()

    const store = createEditorStore<CanvasDocument>()
    let document = createDefaultCanvasDocument()
    let resolveSave: (() => void) | undefined

    const controller = createAutosaveController({
      delayMs: 250,
      store,
      getDocument: () => document,
      save: (nextDocument) =>
        new Promise<void>((resolve) => {
          document = nextDocument
          resolveSave = resolve
        }),
    })

    document = {
      ...document,
      settings: { slug: 'first-edit' },
    }
    store.markDirty()

    await vi.advanceTimersByTimeAsync(250)
    expect(store.getState().dirty).toBe(true)

    document = {
      ...document,
      settings: { slug: 'second-edit' },
    }
    store.markDirty()

    const completeSave = resolveSave
    completeSave?.()
    await Promise.resolve()

    expect(store.getState().dirty).toBe(true)

    controller.dispose()
  })

  it('keeps the editor dirty when autosave rejects', async () => {
    vi.useFakeTimers()

    const store = createEditorStore<CanvasDocument>()
    let document = createDefaultCanvasDocument()
    const save = vi
      .fn<(nextDocument: CanvasDocument) => Promise<void>>()
      .mockRejectedValue(new Error('save failed'))

    const controller = createAutosaveController({
      delayMs: 250,
      store,
      getDocument: () => document,
      save,
    })

    document = {
      ...document,
      settings: { slug: 'home' },
    }
    store.markDirty()

    await vi.advanceTimersByTimeAsync(250)
    await Promise.resolve()

    expect(save).toHaveBeenCalledWith(document)
    expect(store.getState().dirty).toBe(true)

    controller.dispose()
  })
})
