import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

const packageJson = pkg as {
  exports?: Record<string, string>
  files?: string[]
}

describe('package runtime exports', () => {
  it('points public exports to consumable runtime artifacts', () => {
    expect(packageJson.exports?.['.']).toBe('./dist/index.mjs')
    expect(packageJson.exports?.['./sandbox']).toBe('./dist/sandbox-entry.mjs')
    expect(packageJson.exports?.['./admin']).toBe('./dist/admin.mjs')
    expect(packageJson.exports?.['./astro']).toBe('./dist/astro.mjs')
    expect(packageJson.files).toEqual(['dist'])
  })
})
