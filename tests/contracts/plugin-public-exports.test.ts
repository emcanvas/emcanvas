import { describe, expect, it } from 'vitest'

describe('plugin public exports', () => {
  it('defines dedicated root, sandbox, admin, and astro entry modules', async () => {
    const root = await import('../../src/plugin/index.ts')
    const sandbox = await import('../../src/plugin/sandbox-entry.ts')
    const admin = await import('../../src/plugin/admin-entry.ts')
    const astro = await import('../../src/plugin/astro-entry.ts')

    expect(root.default).toBeDefined()
    expect(sandbox.default).toBeDefined()
    expect(admin.pages).toBeDefined()
    expect(astro.blockComponents).toBeDefined()
  })
})
