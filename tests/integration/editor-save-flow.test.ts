import { afterEach, describe, expect, it, vi } from 'vitest'

import { createDefaultCanvasDocument } from '../../src/foundation/model/document-factory'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import '../../src/admin/lib/plugin-api'
import { buildEntryPayload } from '../../src/editor/persistence/entry-payload'
import { loadDocument } from '../../src/editor/persistence/load-document'
import { saveDocument } from '../../src/editor/persistence/save-document'
import { createAutosaveController } from '../../src/editor/state/autosave-controller'
import { createEditorStore } from '../../src/editor/state/editor-store'

interface TestPersistencePort {
  loadDocument: (args: { entry: { data: Record<string, unknown> } }) => Promise<unknown>
  saveDocument: (args: {
    entry: { data: Record<string, unknown> }
    payload: Record<string, unknown>
  }) => Promise<unknown>
  getPreviewLink: (args: { entry: { data: Record<string, unknown> }; origin?: string }) => string
}

afterEach(() => {
  vi.useRealTimers()
})

describe('editor save flow', () => {
  it('lets editor persistence depend on an injected port instead of plugin runtime imports', async () => {
    const entry = {
      data: {
        slug: 'home',
      },
    }
    const canvasLayout = createDefaultCanvasDocument()
    const port: TestPersistencePort = {
      loadDocument: vi.fn().mockResolvedValue({
        canvasLayout,
        _emcanvas: {
          enabled: true,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      }),
      saveDocument: vi.fn().mockResolvedValue({
        ...entry.data,
      }),
      getPreviewLink: vi.fn().mockReturnValue('https://example.test/preview?slug=home&source=emcanvas'),
    }
    type Entry = typeof entry
    type InjectedLoadDocument = (
      entry: Entry,
      port: TestPersistencePort,
    ) => Promise<unknown>
    type InjectedSaveDocument = (
      args: { entry: Entry; canvasLayout: CanvasDocument },
      port: TestPersistencePort,
    ) => Promise<unknown>

    const loadWithInjectedPort = loadDocument as unknown as InjectedLoadDocument
    const saveWithInjectedPort = saveDocument as unknown as InjectedSaveDocument

    await expect(loadWithInjectedPort(entry, port)).resolves.toEqual({
      canvasLayout,
      _emcanvas: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
    })
    await expect(saveWithInjectedPort({ entry, canvasLayout }, port)).resolves.toEqual({
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

  it('loads the persisted canvas document from entry data', async () => {
    const canvasLayout = createDefaultCanvasDocument()
    const meta = {
      enabled: true,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    }

    await expect(
      loadDocument({
        data: {
          slug: 'home',
          [EMCANVAS_LAYOUT_KEY]: canvasLayout,
          [EMCANVAS_ENTRY_META_KEY]: meta,
        },
      }),
    ).resolves.toEqual({
      canvasLayout,
      _emcanvas: meta,
    })
  })

  it('saves the current document back into entry data', async () => {
    const entry = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }
    const canvasLayout = createDefaultCanvasDocument()

    const result = await saveDocument({ entry, canvasLayout })

    expect(result.slug).toBe('home')
    expect(result.title).toBe('Homepage')
    expect(result.canvasLayout).toEqual(canvasLayout)
    expect(result._emcanvas).toEqual({
      enabled: true,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    })
    expect(entry.data).toEqual(result)
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
    let resolveSave: (() => void) | null = null

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

    resolveSave?.()
    await Promise.resolve()

    expect(store.getState().dirty).toBe(true)

    controller.dispose()
  })

  it('keeps the editor dirty when autosave rejects', async () => {
    vi.useFakeTimers()

    const store = createEditorStore<CanvasDocument>()
    let document = createDefaultCanvasDocument()
    const save = vi.fn<(
      nextDocument: CanvasDocument,
    ) => Promise<void>>().mockRejectedValue(new Error('save failed'))

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
