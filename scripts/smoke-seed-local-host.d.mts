export const REQUIRED_SEED_ENV_VARS: string[]
export const SMOKE_SEED_ENTRY_SLUG: string
export const SMOKE_SEED_ENTRY_TITLE: string
export const SMOKE_SEED_INITIAL_HEADING: string
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
export function getMissingSeedEnvVars(
  env?: Record<string, string | undefined>,
): string[]
export function runSmokeSeedLocalHost(options?: {
  env?: Record<string, string | undefined>
  fetchFn?: typeof fetch
  stdout?: { write: (chunk: string) => void }
  stderr?: { write: (chunk: string) => void }
}): Promise<number>
