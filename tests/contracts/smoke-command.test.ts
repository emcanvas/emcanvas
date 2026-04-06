import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'
import {
  DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND,
  MANUAL_SMOKE_DOC_PATHS,
  SMOKE_PREFLIGHT_TEST_PATH,
  runSmokePreflight,
  smokeSummaryLines,
} from '../../scripts/smoke.mjs'

const packageJson = pkg as {
  scripts?: Record<string, string>
}

describe('smoke command', () => {
  it('registers a repo-local smoke command with a bounded docs preflight', () => {
    expect(packageJson.scripts?.smoke).toBe('node ./scripts/smoke.mjs')
    expect(SMOKE_PREFLIGHT_TEST_PATH).toBe(
      'tests/contracts/manual-smoke-harness-docs.test.ts',
    )
    expect(MANUAL_SMOKE_DOC_PATHS).toEqual([
      'docs/integration/manual-smoke-harness-playbook.md',
      'docs/integration/manual-smoke-harness-seeded-scenario.md',
      'docs/integration/manual-smoke-harness-checklist.md',
    ])
  })

  it('keeps the operator guidance shallow and points at the canonical harness docs', () => {
    const summary = smokeSummaryLines.join('\n')

    expect(summary).toContain('bounded preflight only')
    expect(summary).toContain('Docker-backed local EmDash host')
    expect(summary).toContain('seeded `home` / `Homepage` scenario')
    expect(summary).toContain(DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND)
    expect(summary).toContain('manual-smoke-harness-playbook.md')
    expect(summary).toContain('manual-smoke-harness-checklist.md')
    expect(summary).not.toContain('deploy the final site')
  })

  it('fails explicitly when a canonical smoke doc is missing', () => {
    const stderrChunks: string[] = []
    const stdoutChunks: string[] = []
    let spawnCalled = false

    const runSmokePreflightWithDeps =
      runSmokePreflight as unknown as (options: {
        docPaths: string[]
        existsSync: (docPath: string) => boolean
        spawnSync: () => { status: number }
        stdout: { write: (chunk: string) => void }
        stderr: { write: (chunk: string) => void }
      }) => number

    const exitCode = runSmokePreflightWithDeps({
      docPaths: MANUAL_SMOKE_DOC_PATHS,
      existsSync: (docPath: string) =>
        docPath !== 'docs/integration/manual-smoke-harness-checklist.md',
      spawnSync: () => {
        spawnCalled = true

        return { status: 0 }
      },
      stdout: {
        write: (chunk: string) => {
          stdoutChunks.push(chunk)
        },
      },
      stderr: {
        write: (chunk: string) => {
          stderrChunks.push(chunk)
        },
      },
    })

    expect(exitCode).toBe(1)
    expect(spawnCalled).toBe(false)
    expect(stdoutChunks).toEqual([])
    expect(stderrChunks.join('')).toContain('Missing smoke harness docs:')
    expect(stderrChunks.join('')).toContain(
      'docs/integration/manual-smoke-harness-checklist.md',
    )
  })
})
