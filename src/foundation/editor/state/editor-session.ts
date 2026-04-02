import type { CanvasDocument } from '../../types/canvas'
import { createDefaultCanvasDocument } from '../../model/document-factory'

export interface EditorSession {
  title: string
  document: CanvasDocument
}

export function createEditorSession(title = 'EmCanvas'): EditorSession {
  return {
    title,
    document: createDefaultCanvasDocument(),
  }
}
