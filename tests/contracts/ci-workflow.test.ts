import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'

describe('ci workflow', () => {
  it('runs tests and type-checks', () => {
    expect(existsSync('.github/workflows/ci.yml')).toBe(true)

    const workflow = readFileSync('.github/workflows/ci.yml', 'utf8')

    expect(workflow).toContain('pnpm vitest run')
    expect(workflow).toContain('tsc --noEmit')
  })
})
