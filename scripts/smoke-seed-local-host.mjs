import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  REQUIRED_SEED_ENV_VARS,
  SMOKE_SEED_ENTRY_SLUG,
  SMOKE_SEED_ENTRY_TITLE,
  SMOKE_SEED_INITIAL_HEADING,
  buildSmokeSeedDocument,
  buildSmokeSeedEntryPayload,
  getMissingEnvVars,
} from './smoke-local-host-shared.mjs'

export {
  REQUIRED_SEED_ENV_VARS,
  SMOKE_SEED_ENTRY_SLUG,
  SMOKE_SEED_ENTRY_TITLE,
  SMOKE_SEED_INITIAL_HEADING,
  buildSmokeSeedDocument,
  buildSmokeSeedEntryPayload,
}

export function getMissingSeedEnvVars(env = process.env) {
  return getMissingEnvVars(REQUIRED_SEED_ENV_VARS, env)
}

export async function runSmokeSeedLocalHost({
  env = process.env,
  fetchFn = globalThis.fetch,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const missingEnvVars = getMissingSeedEnvVars(env)

  if (missingEnvVars.length > 0) {
    stderr.write(
      [
        'Missing deterministic seed inputs:',
        ...missingEnvVars.map((envVar) => `- ${envVar}`),
        '- Provide a caller-supplied seed endpoint and token before running the local smoke handoff.',
      ].join('\n') + '\n',
    )

    return 1
  }

  if (typeof fetchFn !== 'function') {
    stderr.write(
      'Seed request failed: global fetch is unavailable in this Node runtime.\n',
    )

    return 1
  }

  const payload = buildSmokeSeedEntryPayload()
  const response = await fetchFn(env.EMDASH_SEED_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.EMDASH_SEED_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    stderr.write(
      `Seed request failed: ${response.status} ${response.statusText || 'Unknown error'}\n`,
    )

    return 1
  }

  stdout.write(
    [
      'Deterministic seed completed.',
      `- Entry: ${SMOKE_SEED_ENTRY_TITLE} (${SMOKE_SEED_ENTRY_SLUG})`,
      `- Initial heading: ${SMOKE_SEED_INITIAL_HEADING}`,
    ].join('\n') + '\n',
  )

  return 0
}

const invokedPath = process.argv[1]
const isMainModule =
  typeof invokedPath === 'string' &&
  fileURLToPath(import.meta.url) === invokedPath

if (isMainModule) {
  const exitCode = await runSmokeSeedLocalHost()
  process.exitCode = exitCode
}
