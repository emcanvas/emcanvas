import { describe, expect, it } from 'vitest'

import { buildEntryPayload } from '../../../src/editor/persistence/entry-payload'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../../src/foundation/types/canvas'

function createDocument(): CanvasDocument {
  return {
    version: CANVAS_DOCUMENT_VERSION,
    settings: {},
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    },
  }
}

describe('buildEntryPayload', () => {
  it('adds the emcanvas meta and layout while preserving other entry fields', () => {
    const entryData = { slug: 'home', title: 'Homepage' }
    const canvasLayout = createDocument()

    const result = buildEntryPayload(entryData, canvasLayout)

    expect(result).toEqual({
      slug: 'home',
      title: 'Homepage',
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: canvasLayout,
    })
    expect(result).not.toBe(entryData)
  })

  it('overwrites stale emcanvas keys without mutating the original entry data', () => {
    const entryData = {
      slug: 'home',
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: false,
        version: 0,
        editorVersion: 'legacy',
      },
      [EMCANVAS_LAYOUT_KEY]: { legacy: true },
    }
    const canvasLayout = createDocument()

    const result = buildEntryPayload(entryData, canvasLayout)

    expect(result[EMCANVAS_ENTRY_META_KEY]).toEqual({
      enabled: true,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    })
    expect(result[EMCANVAS_LAYOUT_KEY]).toEqual(canvasLayout)
    expect(result[EMCANVAS_LAYOUT_KEY]).not.toBe(canvasLayout)
    expect(entryData[EMCANVAS_ENTRY_META_KEY]).toEqual({
      enabled: false,
      version: 0,
      editorVersion: 'legacy',
    })
    expect(entryData[EMCANVAS_LAYOUT_KEY]).toEqual({ legacy: true })
  })

  it('rejects structurally invalid canvas documents before persisting them', () => {
    expect(() =>
      buildEntryPayload({}, {
        version: CANVAS_DOCUMENT_VERSION,
        settings: {},
        root: {
          id: 'root',
          type: 'section',
          props: {
            onClick: () => 'boom',
          },
          styles: { desktop: {} },
          children: [],
        },
      } as unknown as CanvasDocument),
    ).toThrow('Invalid canvas payload')
  })
})
