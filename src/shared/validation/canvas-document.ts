import { isCanvasDocument } from '../../foundation/model/guards'
import type { CanvasDocument } from '../../foundation/types/canvas'

export interface CanvasDocumentValidationResult {
  valid: boolean
  errors: string[]
  document: CanvasDocument | null
}

export function validateCanvasDocument(value: unknown): CanvasDocumentValidationResult {
  if (isCanvasDocument(value)) {
    return {
      valid: true,
      errors: [],
      document: value,
    }
  }

  return {
    valid: false,
    errors: ['Canvas document must include version 1, a valid root node, and settings.'],
    document: null,
  }
}
