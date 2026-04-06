import { describe, expect, it } from 'vitest'

import pkg from '../../package.json'
import plugin, {
  createPlugin,
  descriptor as exportedDescriptor,
  manifest,
} from '../../src/plugin'
import descriptor from '../../src/plugin/descriptor'
import { routeAdapters } from '../../src/plugin/runtime/route-adapters'

const packageJson = pkg as {
  name?: string
  main?: string
  exports?: Record<string, string>
  version?: string
}

describe('emdash runtime contract', () => {
  it('keeps the native package runtime surface coherent', () => {
    expect(packageJson.main).toBe('./dist/index.mjs')
    expect(packageJson.exports).toEqual({
      '.': './dist/index.mjs',
      './sandbox': './dist/sandbox-entry.mjs',
      './admin': './dist/admin.mjs',
      './astro': './dist/astro.mjs',
    })

    expect(createPlugin).toBeTypeOf('function')
    expect(exportedDescriptor).toEqual(descriptor)
    expect(manifest).toEqual({
      id: packageJson.name,
      name: 'EmCanvas',
      version: packageJson.version,
    })
    expect(descriptor).toEqual({
      id: packageJson.name,
      version: packageJson.version,
      entrypoint: packageJson.name,
      format: 'module',
      sandbox: `${packageJson.name}/sandbox`,
      adminEntry: `${packageJson.name}/admin`,
      componentsEntry: `${packageJson.name}/astro`,
    })

    const createdPlugin = createPlugin()

    expect(createdPlugin).toEqual(plugin)

    expect(plugin.hooks['page:fragments']).toBeTypeOf('function')
    expect(plugin.hooks['page:metadata']).toBeTypeOf('function')
    expect(plugin.hooks['entry:editor:actions']).toBeTypeOf('function')

    expect(plugin.routes['canvas-data']).toBe(routeAdapters.loadDocument)
    expect(plugin.routes['save-canvas-data']).toBe(routeAdapters.saveDocument)
    expect(plugin.routes['preview-link']).toBe(routeAdapters.getPreviewLink)

    expect(createdPlugin).not.toHaveProperty('adminPages')
    expect(plugin).not.toHaveProperty('adminPages')
  })
})
