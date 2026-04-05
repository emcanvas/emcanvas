import {
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import { validateTakeoverState } from '../../shared/validation/takeover-state'
import { normalizeCanvasDocument } from './normalize-canvas-document'
import type { CanvasEntryState } from '../types/renderer'

export function getCanvasEntryState(data: Record<string, unknown>): CanvasEntryState {
  const layoutValue = data[EMCANVAS_LAYOUT_KEY]
  const document = normalizeCanvasDocument(layoutValue)
  const takeoverState = validateTakeoverState(data)

  return {
    shouldRender: takeoverState.enabled && document !== null,
    document,
  }
}
