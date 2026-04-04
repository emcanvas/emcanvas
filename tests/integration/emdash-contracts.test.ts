// @vitest-environment node

import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../src/foundation/shared/constants'
import * as shouldRenderEmCanvasModule from '../../src/integration/page/should-render-emcanvas'
import {
  getEntryEditorActions,
  type EntryEditorAction,
} from '../../src/plugin/hooks/entry-editor-actions'
import { getPageMetadata } from '../../src/plugin/hooks/page-metadata'
import { pageFragments } from '../../src/plugin/hooks/page-fragments'
import { getCanvasData } from '../../src/plugin/routes/get-canvas-data'
import { validateTakeoverState } from '../../src/shared/validation/takeover-state'
import type { PageFragment } from '../../src/integration/hooks/page-fragments'
import pageMetadataSource from '../../src/plugin/hooks/page-metadata.ts?raw'
import entryEditorActionsSource from '../../src/plugin/hooks/entry-editor-actions.ts?raw'
import pageFragmentsSource from '../../src/plugin/hooks/page-fragments.ts?raw'

describe('EmDash host contracts', () => {
  it('keeps metadata and editor-actions hooks on explicit return contracts', () => {
    expect(pageMetadataSource).toContain(
      'export function getPageMetadata(ctx: { entry: { data: Record<string, unknown> } }): {',
    )
    expect(entryEditorActionsSource).toContain(
      'export function getEntryEditorActions(ctx: {\n  entry: { data: Record<string, unknown> }\n}): EntryEditorAction[] {'.replaceAll(
        '\\n',
        '\n',
      ),
    )
    expect(pageFragmentsSource).toContain(
      'export function pageFragments(ctx: { entry: { data: Record<string, unknown> } }): PageFragment[] {',
    )

    expectTypeOf<ReturnType<typeof getPageMetadata>>().toEqualTypeOf<{
      editor: 'default' | 'emcanvas'
      takeover: boolean
    }>()
    expectTypeOf<ReturnType<typeof getEntryEditorActions>>().toEqualTypeOf<EntryEditorAction[]>()
    expectTypeOf<ReturnType<typeof pageFragments>>().toEqualTypeOf<PageFragment[]>()
  })

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

  it('evaluates takeover state once when building page metadata', () => {
    const entry = {
      data: {
        slug: 'home',
      },
    }

    const shouldRenderSpy = vi
      .spyOn(shouldRenderEmCanvasModule, 'shouldRenderEmCanvas')
      .mockReturnValue(true)

    expect(getPageMetadata({ entry })).toEqual({
      editor: 'emcanvas',
      takeover: true,
    })
    expect(shouldRenderSpy).toHaveBeenCalledTimes(1)

    shouldRenderSpy.mockRestore()
  })
})
