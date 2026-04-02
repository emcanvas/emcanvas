import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import { isCanvasDocument, isEmCanvasEntryMeta } from '../../foundation/model/guards'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'

export async function getCanvasData(ctx: {
  entry: { data: Record<string, unknown> }
}) {
  const data = ctx.entry.data
  const persistedMeta = data[EMCANVAS_ENTRY_META_KEY]

  return {
    canvasLayout: isCanvasDocument(data[EMCANVAS_LAYOUT_KEY])
      ? data[EMCANVAS_LAYOUT_KEY]
      : createDefaultCanvasDocument(),
    _emcanvas: isEmCanvasEntryMeta(persistedMeta)
      ? persistedMeta
      : {
      enabled: false,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
      },
  }
}
