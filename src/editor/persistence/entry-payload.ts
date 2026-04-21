import type { CanvasDocument } from '../../foundation/types/canvas'
import { serializeCanvasDocumentToEntryData } from '../../shared/persistence/canvas-document-entry'

export function buildEntryPayload(
  entryData: Record<string, unknown>,
  canvasLayout: CanvasDocument,
) {
  return serializeCanvasDocumentToEntryData({ entryData, canvasLayout })
}
