import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('eslint baseline', () => {
  it('defines an eslint config and a clean lint script', () => {
    expect(existsSync('eslint.config.js')).toBe(true)

    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts?: Record<string, string>
      devDependencies?: Record<string, string>
    }

    expect(packageJson.scripts?.lint).toBe('eslint . --max-warnings 0')

    expect(packageJson.devDependencies).toMatchObject({
      eslint: expect.any(String),
      '@eslint/js': expect.any(String),
      globals: expect.any(String),
      'typescript-eslint': expect.any(String),
      'eslint-plugin-react-hooks': expect.any(String),
      'eslint-plugin-react-refresh': expect.any(String),
    })

    expect(() =>
      execFileSync('pnpm', ['lint'], {
        encoding: 'utf8',
      }),
    ).not.toThrow()
  })
})
