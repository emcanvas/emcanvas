import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND } from './smoke-local-host-shared.mjs'

export { DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND }

export const SMOKE_PREFLIGHT_TEST_PATH =
  'tests/contracts/manual-smoke-harness-docs.test.ts'

export const MANUAL_SMOKE_DOC_PATHS = [
  'docs/integration/manual-smoke-harness-playbook.md',
  'docs/integration/manual-smoke-harness-seeded-scenario.md',
  'docs/integration/manual-smoke-harness-checklist.md',
]

export const smokeSummaryLines = [
  'EmCanvas smoke: bounded preflight only.',
  `- Preflight verified: ${SMOKE_PREFLIGHT_TEST_PATH}`,
  '- Manual smoke follows the canonical local EmDash path/worktree workflow.',
  '- Use the seeded `home` / `Homepage` scenario for one deterministic sanity pass.',
  '- Start from docs/integration/emdash-local-validation.md for the rebuild/relink/restart order.',
  '- Seed the canonical entry with node ./scripts/smoke-seed-local-host.mjs when your local EmDash host exposes the seed endpoint.',
  `- Optional Docker wrapper: ${DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND}.`,
  '- Follow the canonical harness docs:',
  ...MANUAL_SMOKE_DOC_PATHS.map((docPath) => `  - ${docPath}`),
]

export function getMissingSmokeDocs(
  docPaths = MANUAL_SMOKE_DOC_PATHS,
  fileExists = existsSync,
) {
  return docPaths.filter((docPath) => !fileExists(docPath))
}

export function runSmokePreflight({
  docPaths = MANUAL_SMOKE_DOC_PATHS,
  existsSync: fileExists = existsSync,
  spawnSync: runChild = spawnSync,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const missingDocPaths = getMissingSmokeDocs(docPaths, fileExists)

  if (missingDocPaths.length > 0) {
    stderr.write(
      `Missing smoke harness docs:\n${missingDocPaths
        .map((docPath) => `- ${docPath}`)
        .join('\n')}\n`,
    )

    return 1
  }

  const result = runChild(
    'pnpm',
    ['vitest', 'run', SMOKE_PREFLIGHT_TEST_PATH],
    {
      stdio: 'inherit',
    },
  )

  if (result.status !== 0) {
    return result.status ?? 1
  }

  stdout.write(`${smokeSummaryLines.join('\n')}\n`)

  return 0
}

const invokedPath = process.argv[1]
const isMainModule =
  typeof invokedPath === 'string' &&
  fileURLToPath(import.meta.url) === invokedPath

if (isMainModule) {
  process.exitCode = runSmokePreflight()
}
