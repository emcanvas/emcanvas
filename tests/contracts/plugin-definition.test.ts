import { describe, expect, it } from 'vitest'
import plugin, { manifest } from '../../src/plugin'

describe('plugin definition', () => {
  it('exposes host-compatible hooks, routes, and admin pages', () => {
    expect(plugin.hooks['page:fragments']).toBeDefined()
    expect(plugin.hooks['page:metadata']).toBeDefined()
    expect(plugin.hooks['entry:editor:actions']).toBeDefined()
    expect(plugin.routes['preview-link']).toBeDefined()
    expect(plugin.routes['canvas-data']).toBeDefined()
    expect(plugin.routes['save-canvas-data']).toBeDefined()
    expect(plugin.adminPages.editor).toBeDefined()
    expect(plugin.adminPages.dashboard).toBeDefined()
  })

  it('keeps the package manifest export as public plugin metadata', () => {
    expect(manifest).toEqual({
      id: 'emcanvas',
      name: 'EmCanvas',
      version: '0.1.0',
    })
  })
})
