import type { SpawnSyncReturns } from 'node:child_process'

import { describe, expect, it, vi } from 'vitest'

import {
  DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND,
  DOCKER_LOCAL_HOST_COMPOSE_PATH,
  DOCKER_LOCAL_HOST_PROJECT_NAME,
  DOCKER_LOCAL_HOST_STOP_COMMAND,
  runSmokeDockerLocalHost,
} from '../../scripts/smoke-docker-local-host.mjs'
import {
  SMOKE_SEED_ENTRY_SLUG,
  SMOKE_SEED_ENTRY_TITLE,
  SMOKE_SEED_INITIAL_HEADING,
  buildSmokeSeedEntryPayload,
  runSmokeSeedLocalHost,
} from '../../scripts/smoke-seed-local-host.mjs'

function createWritableChunks() {
  const chunks: string[] = []

  return {
    chunks,
    writer: {
      write(chunk: string) {
        chunks.push(chunk)
      },
    },
  }
}

describe('docker local host runtime contracts', () => {
  it('fails fast with explicit caller-supplied docker and seed requirements', async () => {
    const stderr = createWritableChunks()
    const stdout = createWritableChunks()
    const spawn = vi.fn()
    const runSeed = vi.fn()

    const exitCode = await runSmokeDockerLocalHost({
      args: ['up'],
      env: {
        EMCANVAS_PACKAGE_ROOT: '/repo',
      },
      fileExists: () => false,
      spawn,
      runSeed,
      stdout: stdout.writer,
      stderr: stderr.writer,
    })

    expect(exitCode).toBe(1)
    expect(spawn).not.toHaveBeenCalled()
    expect(runSeed).not.toHaveBeenCalled()
    expect(stdout.chunks).toEqual([])

    const output = stderr.chunks.join('')

    expect(output).toContain('Missing Docker local-host smoke inputs:')
    expect(output).toContain('- EMDASH_IMAGE')
    expect(output).toContain('- EMDASH_ENV_FILE')
    expect(output).toContain('- EMDASH_SEED_ENDPOINT')
    expect(output).toContain('- EMDASH_SEED_TOKEN')
    expect(output).toContain('bootstrap wrapper only')
  })

  it('starts docker compose, runs the deterministic seed, and prints the bounded handoff', async () => {
    const stderr = createWritableChunks()
    const stdout = createWritableChunks()
    const spawn = vi.fn(
      () => ({ status: 0 }) as SpawnSyncReturns<Buffer>,
    ) as unknown as typeof import('node:child_process').spawnSync
    const runSeed = vi.fn(async () => 0)

    const env = {
      EMCANVAS_PACKAGE_ROOT: '/repo',
      EMDASH_IMAGE: 'ghcr.io/example/emdash:local',
      EMDASH_ENV_FILE: '/tmp/emdash.env',
      EMDASH_SEED_ENDPOINT: 'http://localhost:3000/api/seed',
      EMDASH_SEED_TOKEN: 'secret',
    }

    const exitCode = await runSmokeDockerLocalHost({
      args: ['up'],
      env,
      fileExists: () => true,
      spawn,
      runSeed,
      stdout: stdout.writer,
      stderr: stderr.writer,
    })

    expect(exitCode).toBe(0)
    expect(spawn).toHaveBeenCalledTimes(1)
    expect(spawn).toHaveBeenCalledWith(
      'docker',
      [
        'compose',
        '-f',
        DOCKER_LOCAL_HOST_COMPOSE_PATH,
        '-p',
        DOCKER_LOCAL_HOST_PROJECT_NAME,
        'up',
        '-d',
      ],
      {
        stdio: 'inherit',
        env,
      },
    )
    expect(runSeed).toHaveBeenCalledWith({
      env,
      stdout: stdout.writer,
      stderr: stderr.writer,
    })
    expect(stderr.chunks).toEqual([])

    const output = stdout.chunks.join('')

    expect(output).toContain('Docker-backed local EmDash host is ready')
    expect(output).toContain(DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND)
    expect(output).toContain('manual-smoke-harness-playbook.md')
    expect(output).toContain('manual-smoke-harness-seeded-scenario.md')
    expect(output).toContain('manual-smoke-harness-checklist.md')
    expect(output).toContain(DOCKER_LOCAL_HOST_STOP_COMMAND)
  })

  it('posts the exact canonical seed payload to the caller-supplied endpoint', async () => {
    const stdout = createWritableChunks()
    const stderr = createWritableChunks()
    const fetchFn = vi.fn(async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
    })) as unknown as typeof fetch

    const env = {
      EMDASH_SEED_ENDPOINT: 'http://localhost:3000/api/seed',
      EMDASH_SEED_TOKEN: 'secret',
    }

    const exitCode = await runSmokeSeedLocalHost({
      env,
      fetchFn,
      stdout: stdout.writer,
      stderr: stderr.writer,
    })

    expect(exitCode).toBe(0)
    expect(stderr.chunks).toEqual([])
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(fetchFn).toHaveBeenCalledWith(env.EMDASH_SEED_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.EMDASH_SEED_TOKEN}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(buildSmokeSeedEntryPayload()),
    })

    const output = stdout.chunks.join('')

    expect(output).toContain('Deterministic seed completed.')
    expect(output).toContain(SMOKE_SEED_ENTRY_TITLE)
    expect(output).toContain(SMOKE_SEED_ENTRY_SLUG)
    expect(output).toContain(SMOKE_SEED_INITIAL_HEADING)
  })

  it('fails the seed step when the caller-supplied endpoint rejects the canonical payload', async () => {
    const stdout = createWritableChunks()
    const stderr = createWritableChunks()
    const fetchFn = vi.fn(async () => ({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity',
    })) as unknown as typeof fetch

    const exitCode = await runSmokeSeedLocalHost({
      env: {
        EMDASH_SEED_ENDPOINT: 'http://localhost:3000/api/seed',
        EMDASH_SEED_TOKEN: 'secret',
      },
      fetchFn,
      stdout: stdout.writer,
      stderr: stderr.writer,
    })

    expect(exitCode).toBe(1)
    expect(stdout.chunks).toEqual([])
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(stderr.chunks.join('')).toContain(
      'Seed request failed: 422 Unprocessable Entity',
    )
  })
})
