import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import type { EmCanvasEntryMeta } from '../../foundation/types/entry-data'

export async function getCanvasData(ctx: {
  entry: { data: Record<string, unknown> }
}) {
  const data = ctx.entry.data

  return {
    canvasLayout: data[EMCANVAS_LAYOUT_KEY] ?? createDefaultCanvasDocument(),
    meta: (data[EMCANVAS_ENTRY_META_KEY] as EmCanvasEntryMeta | undefined) ?? {
      enabled: false,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    },
  }
}
