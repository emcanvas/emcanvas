import { describe, expect, it } from 'vitest'
import plugin, { manifest } from '../../src/plugin'
import { createRuntimePluginDefinition } from '../../src/plugin/runtime/create-runtime-plugin-definition'

describe('plugin definition', () => {
  it('exposes a native runtime plugin shape with admin metadata aligned to EmDash', () => {
    const hooks = plugin.hooks as Record<string, unknown>

    expect(plugin.id).toBe('emcanvas')
    expect(plugin.name).toBe('EmCanvas')
    expect(plugin.version).toBe('0.1.0')
    expect(plugin.capabilities).toEqual([
      'read:content',
      'write:content',
      'page:inject',
    ])
    expect(hooks['page:fragments']).toEqual({
      priority: 0,
      timeout: 0,
      dependencies: [],
      errorPolicy: 'continue',
      exclusive: false,
      handler: expect.any(Function),
      pluginId: 'emcanvas',
    })
    expect(hooks['page:metadata']).toEqual({
      priority: 0,
      timeout: 0,
      dependencies: [],
      errorPolicy: 'continue',
      exclusive: false,
      handler: expect.any(Function),
      pluginId: 'emcanvas',
    })
    expect(hooks['entry:editor:actions']).toBeUndefined()
    expect(plugin.routes['preview-link']).toEqual({
      handler: expect.any(Function),
    })
    expect(plugin.routes['canvas-data']).toEqual({
      handler: expect.any(Function),
    })
    expect(plugin.routes['save-canvas-data']).toEqual({
      handler: expect.any(Function),
    })
    expect(plugin.storage).toEqual({})
    expect(plugin.admin).toEqual({
      entry: 'emcanvas/admin',
      pages: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: 'layout-dashboard',
        },
        {
          path: '/editor',
          label: 'Editor',
          icon: 'pen-square',
        },
      ],
      widgets: [],
    })
  })

  it('keeps the raw runtime definition available for internal adapters', () => {
    expect(createRuntimePluginDefinition()).toEqual({
      hooks: {
        'page:fragments': expect.any(Function),
        'page:metadata': expect.any(Function),
        'entry:editor:actions': expect.any(Function),
      },
      routes: {
        'preview-link': expect.any(Function),
        'canvas-data': expect.any(Function),
        'save-canvas-data': expect.any(Function),
      },
      storage: {},
      admin: {
        entry: 'emcanvas/admin',
        pages: [
          {
            path: '/dashboard',
            label: 'Dashboard',
            icon: 'layout-dashboard',
          },
          {
            path: '/editor',
            label: 'Editor',
            icon: 'pen-square',
          },
        ],
        widgets: [],
      },
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
