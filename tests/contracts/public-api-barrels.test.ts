import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('public api barrels', () => {
  it('defines barrel files for the main layers', () => {
    expect(existsSync('src/foundation/index.ts')).toBe(true)
    expect(existsSync('src/editor/index.ts')).toBe(true)
    expect(existsSync('src/renderer/index.ts')).toBe(true)
    expect(existsSync('src/admin/index.ts')).toBe(true)
  })
})
