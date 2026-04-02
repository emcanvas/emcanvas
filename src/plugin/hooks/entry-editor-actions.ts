import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import { saveCanvasData } from '../routes/save-canvas-data'
import { validateCanvasDocument } from '../../shared/validation/canvas-document'
import { validateTakeoverState } from '../../shared/validation/takeover-state'

export interface EntryEditorAction {
  id: string
  label: string
  href?: string
  run?: () => Promise<Record<string, unknown>>
}

function getEditorHref(data: Record<string, unknown>) {
  const slug = typeof data.slug === 'string' ? data.slug : ''
  const query = slug.length > 0 ? `?slug=${encodeURIComponent(slug)}` : ''

  return `/admin/plugins/emcanvas/editor${query}`
}

export function getEntryEditorActions(ctx: {
  entry: { data: Record<string, unknown> }
}): EntryEditorAction[] {
  const takeoverState = validateTakeoverState(ctx.entry.data)
  const actions: EntryEditorAction[] = [
    {
      id: 'open-emcanvas-editor',
      label: 'Open EmCanvas editor',
      href: getEditorHref(ctx.entry.data),
    },
  ]

  if (!takeoverState.enabled) {
    actions.unshift({
      id: 'enable-emcanvas',
      label: 'Enable EmCanvas takeover',
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
