import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND,
  DOCKER_LOCAL_HOST_COMPOSE_PATH,
  DOCKER_LOCAL_HOST_ENV_EXAMPLE_PATH,
  DOCKER_LOCAL_HOST_MANUAL_HANDOFF_PATHS,
  DOCKER_LOCAL_HOST_STOP_COMMAND,
  REQUIRED_DOCKER_LOCAL_HOST_ENV_VARS,
  REQUIRED_SEED_ENV_VARS,
  getMissingEnvVars,
  resolveRepoRoot,
} from './smoke-local-host-shared.mjs'
import { runSmokeSeedLocalHost } from './smoke-seed-local-host.mjs'

export {
  DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND,
  DOCKER_LOCAL_HOST_COMPOSE_PATH,
  DOCKER_LOCAL_HOST_ENV_EXAMPLE_PATH,
  DOCKER_LOCAL_HOST_STOP_COMMAND,
  REQUIRED_DOCKER_LOCAL_HOST_ENV_VARS,
}

export const DOCKER_LOCAL_HOST_PROJECT_NAME = 'emcanvas-smoke-local-host'

export function getMissingDockerLocalHostInputs({
  env = process.env,
  fileExists = existsSync,
} = {}) {
  const missingEnvVars = getMissingEnvVars(
    REQUIRED_DOCKER_LOCAL_HOST_ENV_VARS,
    env,
  )
  const envFilePath = env.EMDASH_ENV_FILE
  const missingFiles =
    typeof envFilePath === 'string' && envFilePath.trim().length > 0
      ? fileExists(envFilePath)
        ? []
        : [envFilePath]
      : []

  return {
    missingEnvVars,
    missingFiles,
  }
}

export async function runSmokeDockerLocalHost({
  args = process.argv.slice(2),
  env = process.env,
  spawn = spawnSync,
  fileExists = existsSync,
  stdout = process.stdout,
  stderr = process.stderr,
  runSeed = runSmokeSeedLocalHost,
} = {}) {
  const command = args[0] ?? 'up'
  const repoRoot = env.EMCANVAS_PACKAGE_ROOT || resolveRepoRoot()
  const composeEnv = {
    ...env,
    EMCANVAS_PACKAGE_ROOT: repoRoot,
  }

  if (command === 'down') {
    const result = spawn(
      'docker',
      [
        'compose',
        '-f',
        DOCKER_LOCAL_HOST_COMPOSE_PATH,
        '-p',
        DOCKER_LOCAL_HOST_PROJECT_NAME,
        'down',
      ],
      {
        stdio: 'inherit',
        env: composeEnv,
      },
    )

    return result.status ?? 1
  }

  if (command !== 'up') {
    stderr.write(
      `Unknown Docker smoke command: ${command}. Use \`up\` or \`down\`.\n`,
    )

    return 1
  }

  const { missingEnvVars, missingFiles } = getMissingDockerLocalHostInputs({
    env: composeEnv,
    fileExists,
  })
  const missingSeedEnvVars = getMissingEnvVars(
    REQUIRED_SEED_ENV_VARS,
    composeEnv,
  )

  if (
    missingEnvVars.length > 0 ||
    missingFiles.length > 0 ||
    missingSeedEnvVars.length > 0
  ) {
    stderr.write(
      [
        'Missing Docker local-host smoke inputs:',
        ...missingEnvVars.map((envVar) => `- ${envVar}`),
        ...missingFiles.map((filePath) => `- Missing file: ${filePath}`),
        ...missingSeedEnvVars.map((envVar) => `- ${envVar}`),
        `- Copy ${DOCKER_LOCAL_HOST_ENV_EXAMPLE_PATH} and fill the caller-supplied EmDash values.`,
        '- This repository owns the bootstrap wrapper only; it does not own the EmDash image, runtime secrets, or seed credentials.',
      ].join('\n') + '\n',
    )

    return 1
  }

  const composeUp = spawn(
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
      env: composeEnv,
    },
  )

  if ((composeUp.status ?? 1) !== 0) {
    return composeUp.status ?? 1
  }

  const seedExitCode = await runSeed({
    env: composeEnv,
    stdout,
    stderr,
  })

  if (seedExitCode !== 0) {
    stderr.write(
      `Seed step failed. Stop the local host with \`${DOCKER_LOCAL_HOST_STOP_COMMAND}\` once you finish troubleshooting.\n`,
    )

    return seedExitCode
  }

  stdout.write(
    [
      'Docker-backed local EmDash host is ready for the bounded manual smoke pass.',
      `- Bootstrap command: ${DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND}`,
      '- Handoff docs:',
      ...DOCKER_LOCAL_HOST_MANUAL_HANDOFF_PATHS.map(
        (docPath) => `  - ${docPath}`,
      ),
      `- Stop the host later with: ${DOCKER_LOCAL_HOST_STOP_COMMAND}`,
    ].join('\n') + '\n',
  )

  return 0
}

const invokedPath = process.argv[1]
const isMainModule =
  typeof invokedPath === 'string' &&
  fileURLToPath(import.meta.url) === invokedPath

if (isMainModule) {
  const exitCode = await runSmokeDockerLocalHost()
  process.exitCode = exitCode
}
