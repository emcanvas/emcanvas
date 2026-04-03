import { describe, expect, it } from 'vitest'

describe('plugin public exports', () => {
  it('defines the minimum public contract for each entry module', async () => {
    const root = await import('../../src/plugin/index.ts')
    const sandbox = await import('../../src/plugin/sandbox-entry.ts')
    const admin = await import('../../src/plugin/admin-entry.ts')
    const astro = await import('../../src/plugin/astro-entry.ts')

    expect(root).toMatchObject({
      default: expect.objectContaining({
        hooks: expect.any(Object),
        routes: expect.any(Object),
        adminPages: expect.any(Object),
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
    expect(Object.keys(root).sort()).toEqual(['default', 'descriptor', 'manifest'])

    expect(sandbox).toMatchObject({
      default: expect.objectContaining({
        entrypoint: expect.any(String),
        format: expect.any(String),
        sandbox: expect.any(String),
      }),
    })
    expect(Object.keys(sandbox)).toEqual(['default'])

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
