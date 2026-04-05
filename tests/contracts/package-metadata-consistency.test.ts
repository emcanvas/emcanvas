import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

const packageJson = pkg as {
  private?: boolean
  scripts?: Record<string, string>
}

describe('package metadata consistency', () => {
  it('defines honest package metadata and maintenance scripts', () => {
    expect(packageJson.private).toBe(true)
    expect(packageJson.scripts?.test).toBe('vitest run')
    expect(packageJson.scripts?.['type-check']).toBeUndefined()
    expect(packageJson.scripts?.['test:watch']).toBeDefined()
  })
})
