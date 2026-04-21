import { parseCanvasDocument } from '../../foundation/model/canvas-document-schema'
import type { CanvasDocument } from '../../foundation/types/canvas'

export interface CanvasDocumentValidationResult {
  valid: boolean
  errors: string[]
  document: CanvasDocument | null
}

export function validateCanvasDocument(
  value: unknown,
): CanvasDocumentValidationResult {
  const result = parseCanvasDocument(value)

  if (result.success) {
    return {
      valid: true,
      errors: [],
      document: result.data,
    }
  }

  return {
    valid: false,
    errors: result.errors,
    document: null,
  }
}
