import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

type CompilerExecutionError = {
  status?: number | null
  stdout?: string
  stderr?: string
  message?: string
}

type StrictnessCheckExecutor = (
  file: string,
  args: readonly string[],
  options: { encoding: 'utf8' },
) => string

function runStrictnessCheck(
  executeCompiler: StrictnessCheckExecutor = execFileSync,
): string {
  try {
    return executeCompiler(
      resolveCompilerBinary(),
      ['--noEmit', '--pretty', 'false'],
      {
        encoding: 'utf8',
      },
    )
  } catch (error: unknown) {
    const compilerError = error as CompilerExecutionError

    if (typeof compilerError.status !== 'number') {
      throw error
    }

    return `${compilerError.stdout ?? ''}${compilerError.stderr ?? ''}`
  }
}

function resolveCompilerBinary(): string {
  const candidates = ['./node_modules/.bin/tsc', '../../node_modules/.bin/tsc']

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate
    }
  }

  throw new Error('Unable to locate a tsc binary for strictness smoke checks.')
}

describe('typescript strictness smoke', () => {
  it('throws when the compiler cannot be executed', () => {
    const failingExecFileSync: StrictnessCheckExecutor = () => {
      throw Object.assign(new Error('spawn tsc ENOENT'), { code: 'ENOENT' })
    }

    expect(() => runStrictnessCheck(failingExecFileSync)).toThrow(
      'spawn tsc ENOENT',
    )
  })

  it('keeps actual compiler diagnostics available for assertions', () => {
    const failingExecFileSync: StrictnessCheckExecutor = () => {
      throw {
        status: 2,
        stdout: 'src/example.ts(1,1): error TS1005: expected ;\n',
        stderr: '',
      }
    }

    expect(runStrictnessCheck(failingExecFileSync)).toContain('src/example.ts')
  })

  it('removes strictness fallout from the touched production files', () => {
    const output = runStrictnessCheck()

    expect(output).not.toContain('src/admin/pages/CanvasEditorPage.tsx')
    expect(output).not.toContain('src/editor/inspector/property-inspector.tsx')
  })

  it('keeps tooling and astro surfaces honest without missing-type diagnostics', () => {
    const output = runStrictnessCheck()

    expect(output).not.toContain('tsup.config.ts')
    expect(output).not.toContain('render-entry-page.ts')
    expect(output).not.toContain('renderer-ssr.test.ts')
    expect(output).not.toContain("Cannot find module 'node:")
  })
})
