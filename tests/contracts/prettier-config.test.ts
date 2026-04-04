import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('prettier baseline', () => {
  it('defines a scoped prettier baseline that passes cleanly', () => {
    expect(existsSync('.prettierrc.json')).toBe(true)
    expect(existsSync('.prettierignore')).toBe(true)

    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.format).toBe(
      'prettier --check package.json .prettierrc.json tests/contracts/prettier-config.test.ts',
    )

    expect(() => {
      execSync('pnpm format', {
        encoding: 'utf8',
        stdio: 'pipe',
      })
    }).not.toThrow()
  })
})
