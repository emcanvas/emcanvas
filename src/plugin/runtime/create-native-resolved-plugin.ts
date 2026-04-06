import manifest from '../manifest'

import { createRuntimePluginDefinition } from './create-runtime-plugin-definition'

const nativeCapabilities = [
  'read:content',
  'write:content',
  'page:inject',
] as const

export function createNativeResolvedPlugin() {
  const runtimeDefinition = createRuntimePluginDefinition()

  return {
    id: manifest.id,
    name: manifest.name,
    version: manifest.version,
    capabilities: [...nativeCapabilities],
    hooks: {
      'page:fragments': runtimeDefinition.hooks['page:fragments'],
      'page:metadata': runtimeDefinition.hooks['page:metadata'],
    },
    routes: {
      'preview-link': {
        handler: runtimeDefinition.routes['preview-link'],
      },
      'canvas-data': {
        handler: runtimeDefinition.routes['canvas-data'],
      },
      'save-canvas-data': {
        handler: runtimeDefinition.routes['save-canvas-data'],
      },
    },
  }
}
