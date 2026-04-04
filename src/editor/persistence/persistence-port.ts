import type { EmCanvasEntryMeta } from '../../foundation/types/entry-data'
import type { CanvasEntry } from '../../shared/types/canvas-entry'

export interface PersistencePort {
  loadDocument(args: { entry: CanvasEntry }): Promise<{
    canvasLayout: unknown
    _emcanvas: EmCanvasEntryMeta
  }>
  saveDocument(args: {
    entry: CanvasEntry
    payload: Record<string, unknown>
  }): Promise<Record<string, unknown>>
  getPreviewLink(args: { entry: CanvasEntry; origin?: string }): string
}

let persistencePort: PersistencePort | null = null

export function injectPersistencePort(port: PersistencePort) {
  persistencePort = port
}

export function getPersistencePort() {
  if (persistencePort === null) {
    throw new Error('Editor persistence port has not been injected')
  }

  return persistencePort
}
