import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

const packageJson = pkg as {
  main?: string
  exports?: Record<string, string>
  files?: string[]
  peerDependencies?: Record<string, string>
}

describe('package surface', () => {
  it('exposes the consumable runtime entrypoints', () => {
    expect(packageJson.main).toBe('./dist/index.mjs')
    expect(packageJson.exports).toEqual({
      '.': './dist/index.mjs',
      './sandbox': './dist/sandbox-entry.mjs',
      './admin': './dist/admin.mjs',
      './astro': './dist/astro.mjs',
    })
    expect(packageJson.files).toEqual(['dist'])
    expect(packageJson.peerDependencies).toEqual({
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      astro: '^4.0.0',
    })
  })
})
