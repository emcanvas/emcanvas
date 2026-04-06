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
  it('keeps pnpm smoke local-first and relegates docker bootstrap to an optional wrapper', () => {
    const summary = smokeSummaryLines.join('\n')

    expect(summary).toContain('bounded preflight only')
    expect(summary).toContain('local EmDash path/worktree workflow')
    expect(summary).toContain(DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND)
    expect(summary).toContain('Optional Docker wrapper')
    expect(summary).not.toContain('full EmDash deployment')

    expect(localValidationContent).toContain('## Canonical execution order')
    expect(localValidationContent).toContain(
      '1. Confirm EmDash loads EmCanvas from the canonical repo-root/worktree package path.',
    )
    expect(localValidationContent).toContain(
      '5. Run `pnpm smoke` for the bounded manual-smoke preflight.',
    )
    expect(localValidationContent).toContain('## Optional Docker wrapper')
    expect(localValidationContent).toContain(
      `- If you want the repo-owned Docker bootstrap wrapper, run \`${DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND}\` after the refresh/restart loop.`,
    )
  })

  it('documents explicit local seed inputs, optional docker inputs, and automation boundaries', () => {
    expect(localValidationContent).toContain(
      '## Local seed inputs you must supply',
    )
    expect(localValidationContent).toContain('`EMDASH_SEED_ENDPOINT`')
    expect(localValidationContent).toContain('`EMDASH_SEED_TOKEN`')
    expect(localValidationContent).toContain(
      '## Optional Docker wrapper inputs',
    )
    expect(localValidationContent).toContain('`EMDASH_IMAGE`')
    expect(localValidationContent).toContain('`EMDASH_ENV_FILE`')
    expect(localValidationContent).toContain(
      'This repository does not own the EmDash image',
    )
    expect(localValidationContent).toContain('browser automation')
    expect(localValidationContent).toContain('out of scope')
  })

  it('keeps the manual harness docs wired to the local seeded scenario while preserving docker as optional setup', () => {
    expect(playbookContent).toContain('Run `pnpm smoke` first.')
    expect(playbookContent).toContain(
      'Run `node ./scripts/smoke-seed-local-host.mjs` if you want the deterministic entry created through your local EmDash seed endpoint.',
    )
    expect(playbookContent).toContain(
      'If you prefer the repo-owned wrapper, you can run the optional Docker bootstrap instead.',
    )

    expect(checklistContent).toContain('local rebuild + refresh + seed')
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
