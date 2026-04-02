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
import { loadDocument } from '../../src/editor/persistence/load-document'
import { saveDocument } from '../../src/editor/persistence/save-document'
import { createAutosaveController } from '../../src/editor/state/autosave-controller'
import { createEditorStore } from '../../src/editor/state/editor-store'

afterEach(() => {
  vi.useRealTimers()
})

describe('editor save flow', () => {
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
})
