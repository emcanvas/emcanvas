import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

const packageJson = pkg as {
  exports?: Record<string, string>
  files?: string[]
  main?: string
}

describe('package runtime exports', () => {
  it('points public exports to source-first host entry modules', () => {
    expect(packageJson.exports?.['.']).toBe('./src/plugin/index.ts')
    expect(packageJson.main).toBe('./src/plugin/index.ts')
    expect(packageJson.exports?.['./sandbox']).toBe(
      './src/plugin/sandbox-entry.ts',
    )
    expect(packageJson.exports?.['./admin']).toBe('./src/plugin/admin-entry.ts')
    expect(packageJson.exports?.['./astro']).toBe('./src/plugin/astro-entry.ts')
    expect(packageJson.files).toEqual(['dist'])
  })
})
