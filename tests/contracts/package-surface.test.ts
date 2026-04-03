import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

const packageJson = pkg as {
  main?: string
  exports?: Record<string, string>
  files?: string[]
}

describe('package surface', () => {
  it('exposes plugin runtime and sandbox entrypoints', () => {
    expect(packageJson.main).toBeDefined()
    expect(packageJson.exports?.['.']).toBeDefined()
    expect(packageJson.exports?.['./sandbox']).toBeDefined()
    expect(packageJson.files).toContain('src')
  })
})
