import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

const packageJson = pkg as {
  main?: string
  exports?: Record<string, string>
  files?: string[]
  peerDependencies?: Record<string, string>
}

describe('package surface', () => {
  it('exposes plugin runtime and sandbox entrypoints', () => {
    expect(packageJson.main).toBe('./src/plugin/index.ts')
    expect(packageJson.exports).toEqual({
      '.': './src/plugin/index.ts',
      './sandbox': './src/plugin/sandbox-entry.ts',
    })
    expect(packageJson.files).toEqual(['src'])
    expect(packageJson.peerDependencies).toEqual({
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      astro: '^4.0.0',
    })
  })
})
