import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { getPersistencePort, type PersistencePort } from './persistence-port'

export async function loadDocument(entry: CanvasEntry, port: PersistencePort = getPersistencePort()) {
  return port.loadDocument({ entry })
}
