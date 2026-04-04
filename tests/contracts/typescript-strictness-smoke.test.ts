// @ts-ignore Node types are intentionally not part of this package surface.
import { existsSync } from 'node:fs'
// @ts-ignore Node types are intentionally not part of this package surface.
import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

function resolveCompilerBinary(): string {
  const candidates = [
    './node_modules/.bin/tsc',
    '../../node_modules/.bin/tsc',
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate
    }
  }

  throw new Error('Unable to locate a tsc binary for strictness smoke checks.')
}

describe('typescript strictness smoke', () => {
  it('removes strictness fallout from the touched production files', () => {
    let output = ''

    try {
      output = execFileSync(resolveCompilerBinary(), ['--noEmit', '--pretty', 'false'], {
        encoding: 'utf8',
      })
    } catch (error: unknown) {
      const compilerError = error as { stdout?: string; stderr?: string; message?: string }
      output = `${compilerError.stdout ?? ''}${compilerError.stderr ?? compilerError.message ?? ''}`
    }

    expect(output).not.toContain('src/admin/pages/CanvasEditorPage.tsx')
    expect(output).not.toContain('src/editor/inspector/property-inspector.tsx')
  })
})
