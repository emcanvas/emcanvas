import type { EmCanvasEntryMeta } from '../../foundation/types/entry-data'
import { serializeCanvasDocumentToEntryData } from '../../shared/persistence/canvas-document-entry'

export async function saveCanvasData(ctx: {
  entry: { data: Record<string, unknown> }
  payload: {
    canvasLayout: unknown
    _emcanvas: EmCanvasEntryMeta
  }
}) {
  const { canvasLayout, _emcanvas } = ctx.payload
  const nextData = serializeCanvasDocumentToEntryData({
    entryData: ctx.entry.data,
    canvasLayout,
    _emcanvas,
  })

  ctx.entry.data = nextData

  return nextData
}
