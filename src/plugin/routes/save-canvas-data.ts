import { isEmCanvasEntryMeta } from '../../foundation/model/guards'
import {
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import type { EmCanvasEntryMeta } from '../../foundation/types/entry-data'
import { validateCanvasDocument } from '../../shared/validation/canvas-document'

export async function saveCanvasData(ctx: {
  entry: { data: Record<string, unknown> }
  payload: {
    canvasLayout: unknown
    _emcanvas: EmCanvasEntryMeta
  }
}) {
  const { canvasLayout, _emcanvas } = ctx.payload
  const layoutValidation = validateCanvasDocument(canvasLayout)

  if (!layoutValidation.valid) {
    throw new Error('Invalid canvas payload')
  }

  if (!isEmCanvasEntryMeta(_emcanvas)) {
    throw new Error('Invalid canvas payload')
  }

  const nextData = {
    ...ctx.entry.data,
    [EMCANVAS_LAYOUT_KEY]: layoutValidation.document,
    [EMCANVAS_ENTRY_META_KEY]: _emcanvas,
  }

  ctx.entry.data = nextData

  return nextData
}
