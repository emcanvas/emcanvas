import manifest from '../manifest'

import { createRuntimePluginDefinition } from './create-runtime-plugin-definition'

const nativeCapabilities = [
  'read:content',
  'write:content',
  'page:inject',
] as const

type NativeHookHandler = (...args: never[]) => unknown

interface NativeResolvedHook {
  priority: number
  timeout: number
  dependencies: string[]
  errorPolicy: 'continue'
  exclusive: boolean
  handler: NativeHookHandler
  pluginId: string
}

function createNativeResolvedHook(
  handler: NativeHookHandler,
): NativeResolvedHook {
  return {
    priority: 0,
    timeout: 0,
    dependencies: [],
    errorPolicy: 'continue',
    exclusive: false,
    handler,
    pluginId: manifest.id,
  }
}

export function createNativeResolvedPlugin() {
  const runtimeDefinition = createRuntimePluginDefinition()

  return {
    id: manifest.id,
    name: manifest.name,
    version: manifest.version,
    capabilities: [...nativeCapabilities],
    hooks: {
      'page:fragments': createNativeResolvedHook(
        runtimeDefinition.hooks['page:fragments'],
      ),
      'page:metadata': createNativeResolvedHook(
        runtimeDefinition.hooks['page:metadata'],
      ),
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
