import manifest from '../manifest'

const DEV_SOURCE_PLUGIN_ENTRYPOINTS = {
  entrypoint: '@emcanvas/plugin',
  sandbox: '@emcanvas/plugin/sandbox-entry',
  adminEntry: '@emcanvas/plugin/admin-entry',
  componentsEntry: '@emcanvas/plugin/astro-entry',
} as const

export type DevSourceDescriptor = {
  id: typeof manifest.id
  version: typeof manifest.version
  format: 'module'
  entrypoint: typeof DEV_SOURCE_PLUGIN_ENTRYPOINTS.entrypoint
  sandbox: typeof DEV_SOURCE_PLUGIN_ENTRYPOINTS.sandbox
  adminEntry: typeof DEV_SOURCE_PLUGIN_ENTRYPOINTS.adminEntry
  componentsEntry: typeof DEV_SOURCE_PLUGIN_ENTRYPOINTS.componentsEntry
}

export function createDevSourcePluginDescriptor(): DevSourceDescriptor {
  return {
    id: manifest.id,
    version: manifest.version,
    format: 'module',
    ...DEV_SOURCE_PLUGIN_ENTRYPOINTS,
  }
}
