import { describe, expect, it } from 'vitest'

describe('package build layout', () => {
  it('defines the packaging contract for published runtime artifacts', async () => {
    const { default: tsupConfig } = await import('../../tsup.config')

    expect(tsupConfig.entry).toEqual({
      index: 'src/plugin/index.ts',
      'sandbox-entry': 'src/plugin/sandbox-entry.ts',
      admin: 'src/plugin/admin-entry.ts',
      astro: 'src/plugin/astro-entry.ts',
    })
    expect(tsupConfig.format).toContain('esm')
    expect(tsupConfig.outDir).toBe('dist')
    expect(tsupConfig.splitting).toBe(false)
    expect(tsupConfig.clean).toBe(true)
  })
})
