import { routeAdapters } from '../../plugin/runtime/route-adapters'
import type { CanvasEntry } from '../../shared/types/canvas-entry'

export async function loadDocument(entry: CanvasEntry) {
  return routeAdapters.loadDocument({ entry })
}
