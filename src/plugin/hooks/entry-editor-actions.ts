import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import { isCanvasDocument } from '../../foundation/model/guards'
import { saveCanvasData } from '../routes/save-canvas-data'

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
  const actions: EntryEditorAction[] = [
    {
      id: 'open-emcanvas-editor',
      label: 'Open EmCanvas editor',
      href: getEditorHref(ctx.entry.data),
    },
  ]

  if (!ctx.entry.data._emcanvas || ctx.entry.data._emcanvas.enabled !== true) {
    actions.unshift({
      id: 'enable-emcanvas',
      label: 'Enable EmCanvas takeover',
      run: () =>
        saveCanvasData({
          entry: ctx.entry,
          payload: {
            canvasLayout: isCanvasDocument(ctx.entry.data.canvasLayout)
              ? ctx.entry.data.canvasLayout
              : createDefaultCanvasDocument(),
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
