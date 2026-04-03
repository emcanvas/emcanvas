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
    expect(packageJson.main).toBeDefined()
    expect(packageJson.exports?.['.']).toBeDefined()
    expect(packageJson.exports?.['./sandbox']).toBeDefined()
    expect(packageJson.peerDependencies?.react).toBeDefined()
    expect(packageJson.peerDependencies?.['react-dom']).toBeDefined()
    expect(packageJson.peerDependencies?.astro).toBeDefined()
    expect(packageJson.files).toContain('src')
  })
})
