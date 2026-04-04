import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('prettier baseline', () => {
  it('defines prettier config and format script', () => {
    expect(existsSync('.prettierrc.json')).toBe(true)
    expect(existsSync('.prettierignore')).toBe(true)

    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.format).toBe('prettier --check .')
  })
})
