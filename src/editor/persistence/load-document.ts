import type { CanvasEntry } from '../../shared/types/canvas-entry'
import type { PersistencePort } from './persistence-port'

export async function loadDocumentWithPort(entry: CanvasEntry, port: PersistencePort) {
  return port.loadDocument({ entry })
}
