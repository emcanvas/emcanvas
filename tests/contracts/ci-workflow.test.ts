import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'

describe('ci workflow', () => {
  it('pins the pnpm toolchain and runs verification', () => {
    expect(existsSync('.github/workflows/ci.yml')).toBe(true)
    expect(existsSync('package.json')).toBe(true)

    const workflow = readFileSync('.github/workflows/ci.yml', 'utf8')
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      packageManager?: string
    }

    expect(pkg.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+$/)
    expect(workflow).toMatch(/version:\s*\d+\.\d+\.\d+/)
    expect(workflow).toContain('pnpm vitest run')
    expect(workflow).toContain('tsc --noEmit')
  })
})
