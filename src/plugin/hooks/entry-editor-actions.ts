import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import { saveCanvasData } from '../routes/save-canvas-data'
import manifest from '../manifest'
import {
  EMDASH_ADMIN_BASE_PATH,
  EMCANVAS_EDITOR_PAGE_PATH,
} from '../runtime/plugin-admin-contract'
import { validateCanvasDocument } from '../../shared/validation/canvas-document'
import { validateTakeoverState } from '../../shared/validation/takeover-state'

export interface EntryEditorAction {
  id: string
  label: string
  href?: string
  run?: () => Promise<Record<string, unknown>>
}

function getEditorHref(data: Record<string, unknown>) {
  const search = new URLSearchParams()

  if (typeof data.id === 'string' && data.id.length > 0) {
    search.set('id', data.id)
  }

  if (typeof data.slug === 'string' && data.slug.length > 0) {
    search.set('slug', data.slug)
  }

  if (typeof data.title === 'string' && data.title.length > 0) {
    search.set('title', data.title)
  }

  const query = search.toString()

  return `${EMDASH_ADMIN_BASE_PATH}/plugins/${manifest.id}${EMCANVAS_EDITOR_PAGE_PATH}${query.length > 0 ? `?${query}` : ''}`
}

export function getEntryEditorActions(ctx: {
  entry: { data: Record<string, unknown> }
}): EntryEditorAction[] {
  const takeoverState = validateTakeoverState(ctx.entry.data)
  const actions: EntryEditorAction[] = [
    {
      id: 'open-emcanvas-editor',
      label: 'Edit with EmCanvas',
      href: getEditorHref(ctx.entry.data),
    },
  ]

  if (!takeoverState.enabled) {
    actions.unshift({
      id: 'enable-emcanvas',
      label: 'Enable EmCanvas for this entry',
      run: () =>
        saveCanvasData({
          entry: ctx.entry,
          payload: {
            canvasLayout:
              validateCanvasDocument(ctx.entry.data.canvasLayout).document ??
              createDefaultCanvasDocument(),
            _emcanvas: {
              enabled: true,
              version: 1,
              editorVersion: '0.1.0',
            },
          },
        }),
    })
  }

  return actions
}
