import type { CanvasDocument } from './canvas'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../shared/constants'

export interface EmCanvasEntryMeta {
  enabled: boolean
  version: typeof CANVAS_DOCUMENT_VERSION
  editorVersion: string
}

export interface EmCanvasEntryData {
  [EMCANVAS_ENTRY_META_KEY]?: EmCanvasEntryMeta
  [EMCANVAS_LAYOUT_KEY]?: CanvasDocument
}
