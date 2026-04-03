import { describe, expect, it } from 'vitest'
import plugin, { manifest } from '../../src/plugin'
import { createRuntimePluginDefinition } from '../../src/plugin/runtime/create-runtime-plugin-definition'

describe('plugin definition', () => {
  it('exposes host-compatible hooks and routes without admin pages', () => {
    expect(plugin.hooks['page:fragments']).toBeDefined()
    expect(plugin.hooks['page:metadata']).toBeDefined()
    expect(plugin.hooks['entry:editor:actions']).toBeDefined()
    expect(plugin.routes['preview-link']).toBeDefined()
    expect(plugin.routes['canvas-data']).toBeDefined()
    expect(plugin.routes['save-canvas-data']).toBeDefined()
    expect(plugin).not.toHaveProperty('adminPages')
  })

  it('builds the root runtime definition without admin surfaces', () => {
    expect(createRuntimePluginDefinition()).toEqual({
      hooks: expect.any(Object),
      routes: expect.any(Object),
    })
  })

  it('keeps the package manifest export as public plugin metadata', () => {
    expect(manifest).toEqual({
      id: 'emcanvas',
      name: 'EmCanvas',
      version: '0.1.0',
    })
  })
})
