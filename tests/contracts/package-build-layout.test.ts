import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('package build layout', () => {
  it('defines a build config for runtime artifacts', () => {
    expect(existsSync('tsup.config.ts')).toBe(true)
  })
})
