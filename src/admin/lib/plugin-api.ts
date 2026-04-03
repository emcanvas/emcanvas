import { routeAdapters } from '../../plugin/runtime/route-adapters'

export interface PluginApi {
  loadDocument: typeof routeAdapters.loadDocument
  saveDocument: typeof routeAdapters.saveDocument
  getPreviewLink: typeof routeAdapters.getPreviewLink
}

export const pluginApi: PluginApi = {
  loadDocument: routeAdapters.loadDocument,
  saveDocument: routeAdapters.saveDocument,
  getPreviewLink: routeAdapters.getPreviewLink,
}
