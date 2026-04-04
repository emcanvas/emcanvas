import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { loadDocumentWithPort } from '../../editor/persistence/load-document'
import { type PersistencePort } from '../../editor/persistence/persistence-port'
import { saveDocumentWithPort } from '../../editor/persistence/save-document'
import { routeAdapters } from '../../plugin/runtime/route-adapters'

export interface PluginApi {
  loadDocument(entry: CanvasEntry): ReturnType<PersistencePort['loadDocument']>
  saveDocument(args: { entry: CanvasEntry; canvasLayout: CanvasDocument }): ReturnType<PersistencePort['saveDocument']>
  getPreviewLink: typeof routeAdapters.getPreviewLink
}

const persistencePort: PersistencePort = {
  loadDocument: routeAdapters.loadDocument,
  saveDocument: routeAdapters.saveDocument,
  getPreviewLink: routeAdapters.getPreviewLink,
}

export const pluginApi: PluginApi = {
  loadDocument: (entry) => loadDocumentWithPort(entry, persistencePort),
  saveDocument: (args) => saveDocumentWithPort(args, persistencePort),
  getPreviewLink: persistencePort.getPreviewLink,
}
