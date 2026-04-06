import { describe, expect, it } from 'vitest'
import composeContent from '../../docker/local-host/compose.yaml?raw'
import envExampleContent from '../../docker/local-host/.env.example?raw'
import {
  DOCKER_LOCAL_HOST_COMPOSE_PATH,
  DOCKER_LOCAL_HOST_ENV_EXAMPLE_PATH,
  REQUIRED_DOCKER_LOCAL_HOST_ENV_VARS,
} from '../../scripts/smoke-docker-local-host.mjs'

describe('docker local host bootstrap assets', () => {
  it('defines repo-owned compose assets around caller-supplied EmDash inputs', () => {
    expect(DOCKER_LOCAL_HOST_COMPOSE_PATH).toBe(
      'docker/local-host/compose.yaml',
    )
    expect(DOCKER_LOCAL_HOST_ENV_EXAMPLE_PATH).toBe(
      'docker/local-host/.env.example',
    )
    expect(REQUIRED_DOCKER_LOCAL_HOST_ENV_VARS).toEqual([
      'EMDASH_IMAGE',
      'EMDASH_ENV_FILE',
    ])

    expect(composeContent).toContain('services:')
    expect(composeContent).toContain('image: ${EMDASH_IMAGE:?')
    expect(composeContent).toContain('- ${EMDASH_ENV_FILE:?')
    expect(composeContent).toContain('${EMCANVAS_PACKAGE_ROOT:?')
    expect(composeContent).not.toContain('build:')
  })

  it('documents env placeholders without implying EmDash patching', () => {
    expect(envExampleContent).toContain('EMDASH_IMAGE=')
    expect(envExampleContent).toContain('EMDASH_ENV_FILE=')
    expect(envExampleContent).toContain('EMDASH_SEED_ENDPOINT=')
    expect(envExampleContent).toContain('EMDASH_SEED_TOKEN=')
    expect(envExampleContent).toContain(
      'EmCanvas does not patch or vendor EmDash upstream',
    )
  })
})
