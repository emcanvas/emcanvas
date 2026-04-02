import { getCanvasData } from '../../plugin/routes/get-canvas-data'
import type { CanvasEntry } from '../../shared/types/canvas-entry'

export async function loadDocument(entry: CanvasEntry) {
  const { canvasLayout } = await getCanvasData({ entry })

  return canvasLayout
}
