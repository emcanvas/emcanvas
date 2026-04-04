import {
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import type { EmCanvasEntryData } from '../../foundation/types/entry-data'
import { validateTakeoverState } from '../../shared/validation/takeover-state'
import { normalizeCanvasDocument } from './normalize-canvas-document'
import type { CanvasEntryState } from '../types/renderer'

export function getCanvasEntryState(data: Record<string, unknown>): CanvasEntryState {
  const entryData = data as EmCanvasEntryData
  const document = normalizeCanvasDocument(entryData[EMCANVAS_LAYOUT_KEY])
  const takeoverState = validateTakeoverState(data)

  return {
    shouldRender: takeoverState.enabled && document !== null,
    document,
  }
}
