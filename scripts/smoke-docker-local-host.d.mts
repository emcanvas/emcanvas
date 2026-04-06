export const DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND: string
export const DOCKER_LOCAL_HOST_COMPOSE_PATH: string
export const DOCKER_LOCAL_HOST_ENV_EXAMPLE_PATH: string
export const DOCKER_LOCAL_HOST_STOP_COMMAND: string
export const REQUIRED_DOCKER_LOCAL_HOST_ENV_VARS: string[]
export const DOCKER_LOCAL_HOST_PROJECT_NAME: string
export function getMissingDockerLocalHostInputs(options?: {
  env?: Record<string, string | undefined>
  fileExists?: (filePath: string) => boolean
}): {
  missingEnvVars: string[]
  missingFiles: string[]
}
export function runSmokeDockerLocalHost(options?: {
  args?: string[]
  env?: Record<string, string | undefined>
  spawn?: typeof import('node:child_process').spawnSync
  fileExists?: (filePath: string) => boolean
  stdout?: { write: (chunk: string) => void }
  stderr?: { write: (chunk: string) => void }
  runSeed?: (options?: unknown) => Promise<number>
}): Promise<number>
