// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { isCanvasDocument } from '../../src/foundation/model/guards'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../src/foundation/shared/constants'
import type { EmCanvasEntryData } from '../../src/foundation/types/entry-data'
import { renderEntryPage } from '../../src/integration/page/render-entry-page'
import { shouldRenderEmCanvas } from '../../src/integration/page/should-render-emcanvas'
import { getEntryEditorActions } from '../../src/plugin/hooks/entry-editor-actions'
import { getPageMetadata } from '../../src/plugin/hooks/page-metadata'
import { pageFragments } from '../../src/plugin/hooks/page-fragments'

describe('entry takeover flow', () => {
  it('switches an entry into emcanvas mode', async () => {
    const entry: {
      data: Record<string, unknown> &
        EmCanvasEntryData & { slug: string; title: string }
    } = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }

    const actions = getEntryEditorActions({ entry })
    const enableAction = actions.find(
      (action) => action.id === 'enable-emcanvas',
    )

    expect(enableAction).toBeDefined()
    await enableAction?.run?.()

    expect(shouldRenderEmCanvas(entry.data)).toBe(true)
    expect(isCanvasDocument(entry.data.canvasLayout)).toBe(true)
    expect(getPageMetadata({ entry })).toEqual({
      editor: 'emcanvas',
      takeover: true,
    })
    expect(pageFragments({ entry })).toEqual([
      {
        slot: 'head',
        html: expect.stringContaining('data-emcanvas-page-fragments'),
      },
    ])
  })

  it('keeps takeover metadata and fragments disabled when the persisted layout is invalid', async () => {
    const entry = {
      data: {
        [EMCANVAS_ENTRY_META_KEY]: {
          enabled: true,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
        [EMCANVAS_LAYOUT_KEY]: {
          version: CANVAS_DOCUMENT_VERSION,
          root: {
            id: 'root',
            type: 'section',
            props: {},
            styles: { desktop: {} },
            children: 'invalid',
          },
          settings: {},
        },
      },
    }

    expect(shouldRenderEmCanvas(entry.data)).toBe(false)
    expect(getPageMetadata({ entry })).toEqual({
      editor: 'default',
      takeover: false,
    })
    expect(pageFragments({ entry })).toEqual([])
    await expect(renderEntryPage(entry.data)).resolves.toBeNull()
  })
})
