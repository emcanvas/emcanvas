import { fileURLToPath } from 'node:url'

import manifest from '../manifest'

function createSourceModuleUrl(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url))
}

const DEV_SOURCE_PLUGIN_ENTRYPOINTS = {
  entrypoint: '@emcanvas/plugin',
  sandbox: createSourceModuleUrl('../sandbox-entry.ts'),
  adminEntry: createSourceModuleUrl('../admin-entry.ts'),
  componentsEntry: createSourceModuleUrl('../astro-entry.ts'),
} as const

export type DevSourceDescriptor = {
  id: typeof manifest.id
  version: typeof manifest.version
  format: 'module'
  entrypoint: typeof DEV_SOURCE_PLUGIN_ENTRYPOINTS.entrypoint
  sandbox: string
  adminEntry: string
  componentsEntry: string
}

export function createDevSourcePluginDescriptor(): DevSourceDescriptor {
  return {
    id: manifest.id,
    version: manifest.version,
    format: 'module',
    ...DEV_SOURCE_PLUGIN_ENTRYPOINTS,
  }
}
