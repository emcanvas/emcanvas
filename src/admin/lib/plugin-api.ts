import { loadDocument } from '../../editor/persistence/load-document'
import {
  injectPersistencePort,
  type PersistencePort,
} from '../../editor/persistence/persistence-port'
import { saveDocument } from '../../editor/persistence/save-document'
import { routeAdapters } from '../../plugin/runtime/route-adapters'

export interface PluginApi {
  loadDocument: typeof loadDocument
  saveDocument: typeof saveDocument
  getPreviewLink: typeof routeAdapters.getPreviewLink
}

const persistencePort: PersistencePort = {
  loadDocument: routeAdapters.loadDocument,
  saveDocument: routeAdapters.saveDocument,
  getPreviewLink: routeAdapters.getPreviewLink,
}

injectPersistencePort(persistencePort)

export const pluginApi: PluginApi = {
  loadDocument: (entry) => loadDocument(entry, persistencePort),
  saveDocument: (args) => saveDocument(args, persistencePort),
  getPreviewLink: persistencePort.getPreviewLink,
}
