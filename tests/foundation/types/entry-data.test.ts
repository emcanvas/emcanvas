import { describe, expect, it } from 'vitest'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../../src/foundation/types/canvas'
import type { EmCanvasEntryData } from '../../../src/foundation/types/entry-data'

describe('entry data contract', () => {
  it('accepts the centralized entry keys', () => {
    const layout: CanvasDocument = {
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

    const entryData: EmCanvasEntryData = {
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: layout,
    }

    expect(entryData[EMCANVAS_ENTRY_META_KEY]?.enabled).toBe(true)
    expect(entryData[EMCANVAS_LAYOUT_KEY]).toEqual(layout)
  })
})
