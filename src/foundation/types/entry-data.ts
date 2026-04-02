import type { CanvasDocument } from './canvas'
import { CANVAS_DOCUMENT_VERSION } from '../shared/constants'

export interface EmCanvasEntryMeta {
  enabled: boolean
  version: typeof CANVAS_DOCUMENT_VERSION
  editorVersion: string
}

export interface EmCanvasEntryData {
  _emcanvas?: EmCanvasEntryMeta
  canvasLayout?: CanvasDocument
}
