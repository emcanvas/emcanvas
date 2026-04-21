import type { CanvasEntry } from '../../shared/types/canvas-entry'
import type {
  CanvasDocumentEntryState,
  SerializedCanvasEntryData,
} from '../../shared/persistence/canvas-document-entry'

export interface PersistencePort {
  loadDocument(args: { entry: CanvasEntry }): Promise<CanvasDocumentEntryState>
  saveDocument(args: {
    entry: CanvasEntry
    payload: SerializedCanvasEntryData
  }): Promise<SerializedCanvasEntryData>
  getPreviewLink(args: { entry: CanvasEntry; origin?: string }): string
}
