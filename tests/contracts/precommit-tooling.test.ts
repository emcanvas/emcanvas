import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('precommit tooling', () => {
  it('configures simple-git-hooks and lint-staged', () => {
    expect(existsSync('.lintstagedrc.json')).toBe(true)

    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      devDependencies?: Record<string, string>
      'simple-git-hooks'?: Record<string, string>
    }

    expect(pkg.devDependencies).toMatchObject({
      'lint-staged': expect.any(String),
      'simple-git-hooks': expect.any(String),
    })

    expect(pkg['simple-git-hooks']).toEqual({
      'pre-commit': 'pnpm lint-staged',
    })

    const lintStaged = JSON.parse(readFileSync('.lintstagedrc.json', 'utf8')) as Record<
      string,
      string
    >

    expect(lintStaged).not.toEqual({})
  })
})
