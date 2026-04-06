import { fileURLToPath } from 'node:url'

export const DOCKER_LOCAL_HOST_COMPOSE_PATH = 'docker/local-host/compose.yaml'
export const DOCKER_LOCAL_HOST_ENV_EXAMPLE_PATH =
  'docker/local-host/.env.example'
export const DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND =
  'node ./scripts/smoke-docker-local-host.mjs up'
export const DOCKER_LOCAL_HOST_STOP_COMMAND =
  'node ./scripts/smoke-docker-local-host.mjs down'
export const DOCKER_LOCAL_HOST_MANUAL_HANDOFF_PATHS = [
  'docs/integration/manual-smoke-harness-playbook.md',
  'docs/integration/manual-smoke-harness-seeded-scenario.md',
  'docs/integration/manual-smoke-harness-checklist.md',
]
export const REQUIRED_DOCKER_LOCAL_HOST_ENV_VARS = [
  'EMDASH_IMAGE',
  'EMDASH_ENV_FILE',
]
export const REQUIRED_SEED_ENV_VARS = [
  'EMDASH_SEED_ENDPOINT',
  'EMDASH_SEED_TOKEN',
]
export const SMOKE_SEED_ENTRY_SLUG = 'home'
export const SMOKE_SEED_ENTRY_TITLE = 'Homepage'
export const SMOKE_SEED_INITIAL_HEADING = 'Welcome'
export const SMOKE_SEED_PUBLISHED_HEADING = 'Published heading'
export const CANVAS_DOCUMENT_VERSION = 1

export function getMissingEnvVars(requiredEnvVars, env) {
  return requiredEnvVars.filter((envVar) => {
    const value = env[envVar]

    return typeof value !== 'string' || value.trim().length === 0
  })
}

export function buildSmokeSeedDocument() {
  return {
    version: CANVAS_DOCUMENT_VERSION,
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [
        {
          id: 'heading-1',
          type: 'heading',
          props: {
            text: SMOKE_SEED_INITIAL_HEADING,
            level: 2,
          },
          styles: { desktop: {} },
          children: [],
        },
      ],
    },
    settings: {},
  }
}

export function buildSmokeSeedEntryPayload() {
  return {
    slug: SMOKE_SEED_ENTRY_SLUG,
    title: SMOKE_SEED_ENTRY_TITLE,
    canvasLayout: buildSmokeSeedDocument(),
  }
}

export function resolveRepoRoot() {
  return fileURLToPath(new URL('..', import.meta.url))
}
