import { describe, expect, it } from 'vitest'

import pkg from '../../package.json'

const packageJson = pkg as {
  exports?: Record<string, string>
  main?: string
  scripts?: Record<string, string>
}

describe('package build layout', () => {
  it('keeps source-first package exports while retaining the optional dist build layout', async () => {
    const { default: tsupConfig } = await import('../../tsup.config')

    expect(Array.isArray(tsupConfig)).toBe(false)
    expect(typeof tsupConfig).toBe('object')

    if (
      Array.isArray(tsupConfig) ||
      typeof tsupConfig !== 'object' ||
      tsupConfig === null
    ) {
      throw new Error(
        'Expected tsup.config default export to resolve to a single config object.',
      )
    }

    expect(tsupConfig.entry).toEqual({
      index: 'src/plugin/index.ts',
      descriptor: 'src/plugin/descriptor.ts',
      'sandbox-entry': 'src/plugin/sandbox-entry.ts',
      admin: 'src/plugin/admin-entry.ts',
      astro: 'src/plugin/astro-entry.ts',
    })
    expect(tsupConfig.format).toContain('esm')
    expect(tsupConfig.outDir).toBe('dist')
    expect(tsupConfig.splitting).toBe(false)
    expect(tsupConfig.clean).toBe(true)
    expect(tsupConfig.outExtension?.({ format: 'esm' } as never)).toEqual({
      js: '.mjs',
    })
    expect(packageJson.main).toBe('./src/plugin/index.ts')
    expect(packageJson.exports).toEqual({
      '.': './src/plugin/index.ts',
      './descriptor': './src/plugin/descriptor.ts',
      './sandbox': './src/plugin/sandbox-entry.ts',
      './admin': './src/plugin/admin-entry.ts',
      './astro': './src/plugin/astro-entry.ts',
    })
    expect(packageJson.scripts?.build).toBe('tsup')
  })
})
