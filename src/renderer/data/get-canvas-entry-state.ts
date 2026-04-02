import {
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import type { EmCanvasEntryData } from '../../foundation/types/entry-data'
import { normalizeCanvasDocument } from './normalize-canvas-document'
import type { CanvasEntryState } from '../types/renderer'

export function getCanvasEntryState(data: Record<string, any>): CanvasEntryState {
  const entryData = data as EmCanvasEntryData

  return {
    shouldRender: Boolean(entryData[EMCANVAS_ENTRY_META_KEY]?.enabled),
    document: normalizeCanvasDocument(entryData[EMCANVAS_LAYOUT_KEY]),
  }
}
