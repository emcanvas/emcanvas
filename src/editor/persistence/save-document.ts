import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { buildEntryPayload } from './entry-payload'
import { getPersistencePort, type PersistencePort } from './persistence-port'

export async function saveDocument({
  entry,
  canvasLayout,
}: {
  entry: CanvasEntry
  canvasLayout: CanvasDocument
}, port: PersistencePort = getPersistencePort()) {
  return port.saveDocument({
    entry,
    payload: buildEntryPayload(entry.data, canvasLayout),
  })
}
