export const DOCKER_LOCAL_HOST_COMPOSE_PATH: string
export const DOCKER_LOCAL_HOST_ENV_EXAMPLE_PATH: string
export const DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND: string
export const DOCKER_LOCAL_HOST_STOP_COMMAND: string
export const DOCKER_LOCAL_HOST_MANUAL_HANDOFF_PATHS: string[]
export const REQUIRED_DOCKER_LOCAL_HOST_ENV_VARS: string[]
export const REQUIRED_SEED_ENV_VARS: string[]
export const SMOKE_SEED_ENTRY_SLUG: string
export const SMOKE_SEED_ENTRY_TITLE: string
export const SMOKE_SEED_INITIAL_HEADING: string
export const SMOKE_SEED_PUBLISHED_HEADING: string
export function getMissingEnvVars(
  requiredEnvVars: string[],
  env: Record<string, string | undefined>,
): string[]
export function buildSmokeSeedDocument(): {
  version: number
  root: {
    id: string
    type: string
    props: Record<string, never>
    styles: { desktop: Record<string, never> }
    children: Array<{
      id: string
      type: string
      props: { text: string; level: number }
      styles: { desktop: Record<string, never> }
      children: []
    }>
  }
  settings: Record<string, never>
}
export function buildSmokeSeedEntryPayload(): {
  slug: string
  title: string
  canvasLayout: ReturnType<typeof buildSmokeSeedDocument>
}
export function resolveRepoRoot(): string
