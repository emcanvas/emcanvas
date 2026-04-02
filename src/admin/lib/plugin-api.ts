import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { loadDocument } from '../../editor/persistence/load-document'
import { saveDocument } from '../../editor/persistence/save-document'
import { getPreviewLink } from '../../plugin/routes/preview-link'

export interface PluginApi {
  loadDocument: typeof loadDocument
  saveDocument: (input: { entry: CanvasEntry; canvasLayout: CanvasDocument }) => Promise<Record<string, unknown>>
  getPreviewLink: typeof getPreviewLink
}

export const pluginApi: PluginApi = {
  loadDocument,
  saveDocument,
  getPreviewLink,
}
