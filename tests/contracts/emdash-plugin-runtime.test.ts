import { describe, expect, it } from 'vitest'

import pkg from '../../package.json'
import plugin, { descriptor as exportedDescriptor, manifest } from '../../src/plugin'
import descriptor from '../../src/plugin/descriptor'
import { routeAdapters } from '../../src/plugin/runtime/route-adapters'

const packageJson = pkg as {
  main?: string
  exports?: Record<string, string>
}

describe('emdash runtime contract', () => {
  it('keeps the local host runtime surface coherent', () => {
    expect(packageJson.main).toBe(descriptor.entrypoint)
    expect(packageJson.exports).toEqual({
      '.': descriptor.entrypoint,
      './sandbox': descriptor.sandbox,
    })

    expect(exportedDescriptor).toEqual(descriptor)
    expect(manifest).toEqual({
      id: 'emcanvas',
      name: 'EmCanvas',
      version: '0.1.0',
    })

    expect(plugin.hooks['page:fragments']).toBeTypeOf('function')
    expect(plugin.hooks['page:metadata']).toBeTypeOf('function')
    expect(plugin.hooks['entry:editor:actions']).toBeTypeOf('function')

    expect(plugin.routes['canvas-data']).toBe(routeAdapters.loadDocument)
    expect(plugin.routes['save-canvas-data']).toBe(routeAdapters.saveDocument)
    expect(plugin.routes['preview-link']).toBe(routeAdapters.getPreviewLink)

    expect(plugin.adminPages.editor).toBeTypeOf('function')
    expect(plugin.adminPages.dashboard).toBeTypeOf('function')
  })
})
