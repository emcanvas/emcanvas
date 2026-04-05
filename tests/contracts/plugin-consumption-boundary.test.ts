import { describe, expect, it } from 'vitest'

describe('plugin consumption boundary', () => {
  it('keeps the root runtime host-focused', async () => {
    const root = await import('../../src/plugin/index')

    expect('pages' in root).toBe(false)
    expect('blockComponents' in root).toBe(false)
    expect(root.default).not.toHaveProperty('adminPages')
    expect(root.default).not.toHaveProperty('blockComponents')
    expect(Object.keys(root).sort()).toEqual([
      'default',
      'descriptor',
      'manifest',
    ])
  })

  it('keeps the admin entry isolated to admin pages', async () => {
    const admin = await import('../../src/plugin/admin-entry')

    expect(Object.keys(admin)).toEqual(['pages'])
    expect(admin.pages).toMatchObject({
      dashboard: expect.any(Function),
      editor: expect.any(Function),
    })
  })

  it('keeps the astro entry isolated to astro blocks', async () => {
    const astro = await import('../../src/plugin/astro-entry')

    expect(Object.keys(astro)).toEqual(['blockComponents'])
    expect(astro.blockComponents).toEqual({})
  })
})
