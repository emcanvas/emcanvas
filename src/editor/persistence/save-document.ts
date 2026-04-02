import type { CanvasDocument } from '../../foundation/types/canvas'
import { saveCanvasData } from '../../plugin/routes/save-canvas-data'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { buildEntryPayload } from './entry-payload'

export async function saveDocument({
  entry,
  canvasLayout,
}: {
  entry: CanvasEntry
  canvasLayout: CanvasDocument
}) {
  return saveCanvasData({
    entry,
    payload: buildEntryPayload(entry.data, canvasLayout),
  })
}
