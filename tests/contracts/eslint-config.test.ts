// @ts-ignore Node types are intentionally not part of this package surface.
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('eslint baseline', () => {
  it('defines an eslint config and lint script', () => {
    expect(existsSync('eslint.config.js')).toBe(true)

    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.lint).toBe('eslint .')
  })
})
