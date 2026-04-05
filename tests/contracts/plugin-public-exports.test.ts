import { describe, expect, it } from 'vitest'

describe('plugin public exports', () => {
  it('defines the minimum public contract for each entry module', async () => {
    const root = await import('../../src/plugin/index')
    const sandbox = await import('../../src/plugin/sandbox-entry')
    const admin = await import('../../src/plugin/admin-entry')
    const astro = await import('../../src/plugin/astro-entry')

    expect(root).toMatchObject({
      default: expect.objectContaining({
        hooks: expect.any(Object),
        routes: expect.any(Object),
      }),
      descriptor: expect.objectContaining({
        entrypoint: expect.any(String),
        format: expect.any(String),
        sandbox: expect.any(String),
      }),
      manifest: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        version: expect.any(String),
      }),
    })
    expect(Object.keys(root).sort()).toEqual([
      'default',
      'descriptor',
      'manifest',
    ])
    expect(root.default).not.toHaveProperty('adminPages')

    expect(sandbox).toMatchObject({
      default: expect.objectContaining({
        entrypoint: expect.any(String),
        format: expect.any(String),
        sandbox: expect.any(String),
      }),
    })
    expect(Object.keys(sandbox)).toEqual(['default'])
    expect(Object.keys(sandbox.default).sort()).toEqual([
      'entrypoint',
      'format',
      'sandbox',
    ])
    expect(sandbox.default).not.toBe(root.descriptor)

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
