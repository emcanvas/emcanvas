// @vitest-environment node

import { describe, expect, it } from 'vitest'

import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../src/foundation/shared/constants'
import { getEntryEditorActions } from '../../src/plugin/hooks/entry-editor-actions'
import { getCanvasData } from '../../src/plugin/routes/get-canvas-data'
import { validateTakeoverState } from '../../src/shared/validation/takeover-state'

describe('EmDash host contracts', () => {
  it('treats takeover as disabled when persisted metadata and layout are inconsistent', async () => {
    const entry = {
      data: {
        slug: 'home',
        _emcanvas: {
          enabled: true,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
        canvasLayout: {
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

    expect(validateTakeoverState(entry.data)).toEqual({
      enabled: false,
      valid: false,
      errors: ['EmCanvas takeover requires a valid canvasLayout document.'],
    })

    await expect(getCanvasData({ entry })).resolves.toMatchObject({
      _emcanvas: {
        enabled: false,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
    })

    expect(getEntryEditorActions({ entry }).map((action) => action.id)).toContain('enable-emcanvas')
  })
})
