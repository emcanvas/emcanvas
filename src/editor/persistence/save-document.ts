import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { buildEntryPayload } from './entry-payload'
import type { PersistencePort } from './persistence-port'

export async function saveDocumentWithPort({
  entry,
  canvasLayout,
}: {
  entry: CanvasEntry
  canvasLayout: CanvasDocument
}, port: PersistencePort) {
  return port.saveDocument({
    entry,
    payload: buildEntryPayload(entry.data, canvasLayout),
  })
}
