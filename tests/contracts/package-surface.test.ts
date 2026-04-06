import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

const packageJson = pkg as {
  main?: string
  exports?: Record<string, string>
  files?: string[]
  peerDependencies?: Record<string, string>
}

describe('package surface', () => {
  it('exposes source-first runtime entrypoints while keeping dist artifact-only', () => {
    expect(packageJson.main).toBe('./src/plugin/index.ts')
    expect(packageJson.exports).toEqual({
      '.': './src/plugin/index.ts',
      './sandbox': './src/plugin/sandbox-entry.ts',
      './admin': './src/plugin/admin-entry.ts',
      './astro': './src/plugin/astro-entry.ts',
    })
    expect(packageJson.files).toEqual(['dist'])
    expect(packageJson.peerDependencies).toEqual({
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      astro: '^4.0.0',
    })
  })
})
