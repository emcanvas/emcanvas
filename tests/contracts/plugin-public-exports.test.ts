import { describe, expect, it } from 'vitest'

describe('plugin public exports', () => {
  it('defines the minimum public contract for each entry module', async () => {
    const root = await import('../../src/plugin/index')
    const descriptor = await import('../../src/plugin/descriptor')
    const sandbox = await import('../../src/plugin/sandbox-entry')
    const admin = await import('../../src/plugin/admin-entry')
    const astro = await import('../../src/plugin/astro-entry')

    expect(root).toMatchObject({
      createPlugin: expect.any(Function),
      default: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        version: expect.any(String),
        capabilities: expect.any(Array),
        admin: expect.any(Object),
        hooks: expect.any(Object),
        routes: expect.any(Object),
      }),
      manifest: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        version: expect.any(String),
      }),
    })
    expect(Object.keys(root).sort()).toEqual([
      'createPlugin',
      'default',
      'manifest',
    ])

    expect(descriptor).toMatchObject({
      default: expect.objectContaining({
        id: expect.any(String),
        version: expect.any(String),
        entrypoint: expect.any(String),
        format: expect.any(String),
        adminEntry: expect.any(String),
        componentsEntry: expect.any(String),
        adminPages: expect.any(Array),
      }),
    })
    expect(Object.keys(descriptor)).toEqual(['default'])

    expect(sandbox).toMatchObject({
      default: expect.objectContaining({
        id: expect.any(String),
        version: expect.any(String),
        entrypoint: expect.any(String),
        format: expect.any(String),
        adminEntry: expect.any(String),
        componentsEntry: expect.any(String),
        adminPages: expect.any(Array),
      }),
    })
    expect(Object.keys(sandbox)).toEqual(['default'])
    expect(Object.keys(sandbox.default).sort()).toEqual([
      'adminEntry',
      'adminPages',
      'componentsEntry',
      'entrypoint',
      'format',
      'id',
      'version',
    ])
    expect(sandbox.default).toEqual(descriptor.default)
    expect(sandbox.default).not.toBe(descriptor.default)

    expect(admin).toMatchObject({
      pages: {
        dashboard: expect.any(Function),
        editor: expect.any(Function),
      },
    })
    expect(Object.keys(admin)).toEqual(['pages'])
    expect(Object.keys(admin.pages).sort()).toEqual(['dashboard', 'editor'])

    expect(astro).toMatchObject({
      blockComponents: expect.any(Object),
    })
    expect(Object.keys(astro)).toEqual(['blockComponents'])
  })
})
