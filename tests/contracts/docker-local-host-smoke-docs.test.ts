import { describe, expect, it } from 'vitest'
import localValidationContent from '../../docs/integration/emdash-local-validation.md?raw'
import checklistContent from '../../docs/integration/manual-smoke-harness-checklist.md?raw'
import playbookContent from '../../docs/integration/manual-smoke-harness-playbook.md?raw'
import seededScenarioContent from '../../docs/integration/manual-smoke-harness-seeded-scenario.md?raw'
import {
  DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND,
  smokeSummaryLines,
} from '../../scripts/smoke.mjs'

describe('docker local host smoke docs', () => {
  it('keeps pnpm smoke as the bounded preflight and hands off to docker bootstrap', () => {
    const summary = smokeSummaryLines.join('\n')

    expect(summary).toContain('bounded preflight only')
    expect(summary).toContain(DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND)
    expect(summary).not.toContain('full EmDash deployment')

    expect(localValidationContent).toContain('## Canonical execution order')
    expect(localValidationContent).toContain('1. Run `pnpm smoke`')
    expect(localValidationContent).toContain(
      `2. Run \`${DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND}\``,
    )
    expect(localValidationContent).toContain(
      '3. Continue with `docs/integration/manual-smoke-harness-playbook.md`',
    )
  })

  it('documents explicit external host inputs and automation boundaries', () => {
    expect(localValidationContent).toContain(
      '## External inputs you must supply',
    )
    expect(localValidationContent).toContain('`EMDASH_IMAGE`')
    expect(localValidationContent).toContain('`EMDASH_ENV_FILE`')
    expect(localValidationContent).toContain('`EMDASH_SEED_ENDPOINT`')
    expect(localValidationContent).toContain('`EMDASH_SEED_TOKEN`')
    expect(localValidationContent).toContain(
      'This repository does not own the EmDash image',
    )
    expect(localValidationContent).toContain('browser automation')
    expect(localValidationContent).toContain('out of scope')
  })

  it('keeps the manual harness docs wired to the docker-backed seed handoff', () => {
    expect(playbookContent).toContain('Run `pnpm smoke` first.')
    expect(playbookContent).toContain(
      `Run \`${DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND}\` before opening the host UI.`,
    )
    expect(playbookContent).toContain(
      'The Docker bootstrap seeds the canonical `home` / `Homepage` entry.',
    )

    expect(checklistContent).toContain('docker bootstrap + seed')
    expect(checklistContent).toContain(
      '`tests/contracts/docker-local-host-smoke-docs.test.ts`',
    )

    expect(seededScenarioContent).toContain(
      '`scripts/smoke-seed-local-host.mjs`',
    )
    expect(seededScenarioContent).toContain('`EMDASH_SEED_ENDPOINT`')
    expect(seededScenarioContent).toContain('`EMDASH_SEED_TOKEN`')
  })
})
