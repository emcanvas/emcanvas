import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import { validateCanvasDocument } from '../../shared/validation/canvas-document'
import {
  getDefaultTakeoverMeta,
  validateTakeoverState,
} from '../../shared/validation/takeover-state'
import {
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import type { EmCanvasEntryMeta } from '../../foundation/types/entry-data'

export async function getCanvasData(ctx: {
  entry: { data: Record<string, unknown> }
}) {
  const data = ctx.entry.data
  const layoutValidation = validateCanvasDocument(data[EMCANVAS_LAYOUT_KEY])
  const takeoverState = validateTakeoverState(data)

  return {
    canvasLayout: layoutValidation.document ?? createDefaultCanvasDocument(),
    _emcanvas:
      takeoverState.enabled === true
        ? (data[EMCANVAS_ENTRY_META_KEY] as EmCanvasEntryMeta)
        : getDefaultTakeoverMeta(),
  }
}
