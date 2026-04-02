import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import type { CanvasDocument } from '../../foundation/types/canvas'

export function buildEntryPayload(
  entryData: Record<string, unknown>,
  canvasLayout: CanvasDocument,
) {
  return {
    ...entryData,
    [EMCANVAS_ENTRY_META_KEY]: {
      enabled: true,
      version: CANVAS_DOCUMENT_VERSION,
      editorVersion: EMCANVAS_EDITOR_VERSION,
    },
    [EMCANVAS_LAYOUT_KEY]: canvasLayout,
  }
}
