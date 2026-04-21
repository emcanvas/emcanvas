import { loadCanvasDocumentState } from '../../shared/persistence/canvas-document-entry'

export async function getCanvasData(ctx: {
  entry: { data: Record<string, unknown> }
}) {
  return loadCanvasDocumentState(ctx.entry.data)
}
