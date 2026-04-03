import { getCanvasData } from '../routes/get-canvas-data'
import { getPreviewLink as previewLink } from '../routes/preview-link'
import { saveCanvasData } from '../routes/save-canvas-data'

export const routeAdapters = {
  loadDocument: getCanvasData,
  saveDocument: saveCanvasData,
  getPreviewLink: previewLink,
}
