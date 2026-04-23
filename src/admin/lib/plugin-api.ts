import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { loadDocumentWithPort } from '../../editor/persistence/load-document'
import { type PersistencePort } from '../../editor/persistence/persistence-port'
import { saveDocumentWithPort } from '../../editor/persistence/save-document'
import { canUseEmDashContentApi, emdashContentApi } from './emdash-content-api'
import { routeAdapters } from '../../plugin/runtime/route-adapters'

export interface PluginApi {
  loadDocument(entry: CanvasEntry): ReturnType<PersistencePort['loadDocument']>
  saveDocument(args: {
    entry: CanvasEntry
    canvasLayout: CanvasDocument
  }): ReturnType<PersistencePort['saveDocument']>
  getPreviewLink: typeof routeAdapters.getPreviewLink
}

const persistencePort: PersistencePort = {
  loadDocument: routeAdapters.loadDocument,
  saveDocument: routeAdapters.saveDocument,
  getPreviewLink: routeAdapters.getPreviewLink,
}

function resolvePersistencePort(entry: CanvasEntry): PersistencePort {
  if (canUseEmDashContentApi(entry)) {
    return emdashContentApi
  }

  return persistencePort
}

export const pluginApi: PluginApi = {
  loadDocument: (entry) =>
    loadDocumentWithPort(entry, resolvePersistencePort(entry)),
  saveDocument: (args) =>
    saveDocumentWithPort(args, resolvePersistencePort(args.entry)),
  getPreviewLink: persistencePort.getPreviewLink,
}
