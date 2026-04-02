import { isEmCanvasEntryMeta } from '../../foundation/model/guards'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import type { EmCanvasEntryMeta } from '../../foundation/types/entry-data'
import { validateCanvasDocument } from './canvas-document'

export interface TakeoverStateValidationResult {
  enabled: boolean
  valid: boolean
  errors: string[]
}

export function getDefaultTakeoverMeta(): EmCanvasEntryMeta {
  return {
    enabled: false,
    version: CANVAS_DOCUMENT_VERSION,
    editorVersion: EMCANVAS_EDITOR_VERSION,
  }
}

export function validateTakeoverState(
  data: Record<string, unknown>,
): TakeoverStateValidationResult {
  const meta = data[EMCANVAS_ENTRY_META_KEY]

  if (meta === undefined) {
    return {
      enabled: false,
      valid: true,
      errors: [],
    }
  }

  if (!isEmCanvasEntryMeta(meta)) {
    return {
      enabled: false,
      valid: false,
      errors: ['EmCanvas takeover metadata is invalid.'],
    }
  }

  if (meta.enabled !== true) {
    return {
      enabled: false,
      valid: true,
      errors: [],
    }
  }

  const layoutValidation = validateCanvasDocument(data[EMCANVAS_LAYOUT_KEY])

  if (!layoutValidation.valid) {
    return {
      enabled: false,
      valid: false,
      errors: ['EmCanvas takeover requires a valid canvasLayout document.'],
    }
  }

  return {
    enabled: true,
    valid: true,
    errors: [],
  }
}
