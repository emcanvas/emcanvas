import { describe, expect, it } from 'vitest'
import { existsSync } from 'fs'

describe('consumable package docs', () => {
  it('documents the runtime package checklist', () => {
    expect(existsSync('docs/integration/emdash-consumable-package-checklist.md')).toBe(true)
  })
})
