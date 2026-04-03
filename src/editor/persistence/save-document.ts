import type { CanvasDocument } from '../../foundation/types/canvas'
import { routeAdapters } from '../../plugin/runtime/route-adapters'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { buildEntryPayload } from './entry-payload'

export async function saveDocument({
  entry,
  canvasLayout,
}: {
  entry: CanvasEntry
  canvasLayout: CanvasDocument
}) {
  return routeAdapters.saveDocument({
    entry,
    payload: buildEntryPayload(entry.data, canvasLayout),
  })
}
