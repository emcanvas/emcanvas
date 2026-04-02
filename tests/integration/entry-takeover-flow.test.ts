import { describe, expect, it } from 'vitest'

import { isCanvasDocument } from '../../src/foundation/model/guards'
import { shouldRenderEmCanvas } from '../../src/integration/page/should-render-emcanvas'
import { getEntryEditorActions } from '../../src/plugin/hooks/entry-editor-actions'
import { getPageMetadata } from '../../src/plugin/hooks/page-metadata'
import { pageFragments } from '../../src/plugin/hooks/page-fragments'

describe('entry takeover flow', () => {
  it('switches an entry into emcanvas mode', async () => {
    const entry = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }

    const actions = getEntryEditorActions({ entry })
    const enableAction = actions.find((action) => action.id === 'enable-emcanvas')

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
})
