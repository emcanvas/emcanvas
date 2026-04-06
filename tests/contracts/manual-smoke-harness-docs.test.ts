import { describe, expect, it } from 'vitest'
import finalChecklistContent from '../../docs/release/final-checklist.md?raw'
import localValidationContent from '../../docs/integration/emdash-local-validation.md?raw'
import pluginRuntimeChecklistContent from '../../docs/integration/emdash-plugin-runtime-checklist.md?raw'
import checklistContent from '../../docs/integration/manual-smoke-harness-checklist.md?raw'
import playbookContent from '../../docs/integration/manual-smoke-harness-playbook.md?raw'
import seededScenarioContent from '../../docs/integration/manual-smoke-harness-seeded-scenario.md?raw'
import readmeContent from '../../README.md?raw'

describe('manual smoke harness docs', () => {
  it('documents the bounded EmDash host playbook and publish boundary', () => {
    expect(playbookContent).toContain(
      '# EmCanvas manual smoke harness playbook',
    )
    expect(playbookContent).toContain('## Scope and boundary')
    expect(playbookContent).toContain('## Prerequisites')
    expect(playbookContent).toContain('## Operator flow')
    expect(playbookContent).toContain(
      'EmCanvas Publish only persists `canvasLayout` and `_emcanvas` takeover metadata',
    )
    expect(playbookContent).toContain('It does not deploy the final site')
    expect(playbookContent).toContain(
      'Enable EmCanvas takeover or open the EmCanvas editor for the seeded entry.',
    )
    expect(playbookContent).toContain(
      'Edit the heading text from `Welcome` to `Published heading`.',
    )
    expect(playbookContent).toContain(
      'Open the preview link for the same entry.',
    )
    expect(playbookContent).toContain(
      'Re-open the same entry and confirm the saved EmCanvas state is still coherent.',
    )
  })

  it('documents the deterministic seeded scenario', () => {
    expect(seededScenarioContent).toContain(
      '# EmCanvas manual smoke seeded scenario',
    )
    expect(seededScenarioContent).toContain('`slug`: `home`')
    expect(seededScenarioContent).toContain('`title`: `Homepage`')
    expect(seededScenarioContent).toContain('`Welcome`')
    expect(seededScenarioContent).toContain('`Published heading`')
    expect(seededScenarioContent).toContain('`createFixtureDocument()`')
    expect(seededScenarioContent).toContain('`createFixtureHeadingNode()`')
    expect(seededScenarioContent).toContain('takeover enabled')
    expect(seededScenarioContent).toContain('preview URL available')
    expect(seededScenarioContent).toContain('reopen state coherent')
  })

  it('maps manual checklist items to the existing integration contracts', () => {
    expect(checklistContent).toContain('# EmCanvas manual smoke checklist')
    expect(checklistContent).toContain('local rebuild + refresh + seed')
    expect(checklistContent).toContain(
      'tests/integration/admin-editor-publish-flow.test.tsx',
    )
    expect(checklistContent).toContain(
      'tests/integration/entry-takeover-flow.test.ts',
    )
    expect(checklistContent).toContain(
      'tests/integration/preview-and-publish-flow.test.ts',
    )
    expect(checklistContent).toContain('editor mount')
    expect(checklistContent).toContain('takeover enabled state')
    expect(checklistContent).toContain('persisted heading mutation')
    expect(checklistContent).toContain('preview URL generation')
    expect(checklistContent).toContain('rendered published markup')
    expect(checklistContent).toContain('reopen coherence')
  })

  it('links the smoke harness from local validation and release docs without implying site deployment', () => {
    expect(localValidationContent).toContain(
      'node ./scripts/smoke-seed-local-host.mjs',
    )
    expect(localValidationContent).toContain(
      'docs/integration/manual-smoke-harness-playbook.md',
    )
    expect(localValidationContent).toContain(
      'docs/integration/manual-smoke-harness-seeded-scenario.md',
    )
    expect(localValidationContent).toContain(
      'docs/integration/manual-smoke-harness-checklist.md',
    )
    expect(localValidationContent).toContain(
      'Run the manual smoke harness when you need a real EmDash host sanity check',
    )

    expect(finalChecklistContent).toContain(
      'docs/integration/manual-smoke-harness-checklist.md',
    )
    expect(finalChecklistContent).toContain(
      'validates payload persistence and preview behavior only',
    )
    expect(finalChecklistContent).toContain('not final site deployment')
  })

  it('documents the rebuild, relink, restart, and smoke handoff order', () => {
    expect(localValidationContent).toContain(
      'Confirm EmDash loads EmCanvas from the canonical repo-root/worktree package path.',
    )
    expect(localValidationContent).toContain(
      'Run `pnpm build` to refresh the `dist/*` artifacts EmDash consumes.',
    )
    expect(localValidationContent).toContain(
      'Reconfirm or refresh the canonical EmCanvas repo-root/worktree dependency in EmDash if the host still points at stale artifacts.',
    )
    expect(localValidationContent).toContain(
      'Restart or reload EmDash so the host resolves the refreshed local package before trusting validation output.',
    )
    expect(localValidationContent).toContain(
      'Run `pnpm smoke` for the bounded manual-smoke preflight.',
    )
    expect(localValidationContent).toContain(
      'Run `node ./scripts/smoke-seed-local-host.mjs` when you want the deterministic `home` / `Homepage` entry created through a local EmDash seed endpoint.',
    )

    expect(
      localValidationContent.indexOf(
        'Confirm EmDash loads EmCanvas from the canonical repo-root/worktree package path.',
      ),
    ).toBeLessThan(
      localValidationContent.indexOf(
        'Run `pnpm build` to refresh the `dist/*` artifacts EmDash consumes.',
      ),
    )
    expect(
      localValidationContent.indexOf(
        'Run `pnpm build` to refresh the `dist/*` artifacts EmDash consumes.',
      ),
    ).toBeLessThan(
      localValidationContent.indexOf(
        'Reconfirm or refresh the canonical EmCanvas repo-root/worktree dependency in EmDash if the host still points at stale artifacts.',
      ),
    )
    expect(
      localValidationContent.indexOf(
        'Reconfirm or refresh the canonical EmCanvas repo-root/worktree dependency in EmDash if the host still points at stale artifacts.',
      ),
    ).toBeLessThan(
      localValidationContent.indexOf(
        'Restart or reload EmDash so the host resolves the refreshed local package before trusting validation output.',
      ),
    )
    expect(
      localValidationContent.indexOf(
        'Restart or reload EmDash so the host resolves the refreshed local package before trusting validation output.',
      ),
    ).toBeLessThan(
      localValidationContent.indexOf(
        'Run `pnpm smoke` for the bounded manual-smoke preflight.',
      ),
    )
    expect(
      localValidationContent.indexOf(
        'Run `pnpm smoke` for the bounded manual-smoke preflight.',
      ),
    ).toBeLessThan(
      localValidationContent.indexOf(
        'Run `node ./scripts/smoke-seed-local-host.mjs` when you want the deterministic `home` / `Homepage` entry created through a local EmDash seed endpoint.',
      ),
    )
  })

  it('keeps README and plugin runtime docs aligned to the same local host workflow', () => {
    expect(pluginRuntimeChecklistContent).toContain(
      '- Load EmCanvas from the canonical repo-root/worktree package path in EmDash.',
    )
    expect(pluginRuntimeChecklistContent).toContain(
      '- After package-facing changes, run `pnpm build`, relink or refresh that same path dependency if needed, then restart or reload EmDash before manual validation.',
    )
    expect(pluginRuntimeChecklistContent).toContain(
      '- EmCanvas stays documented as a native EmDash plugin package with a named `createPlugin()` root factory.',
    )
    expect(pluginRuntimeChecklistContent).not.toContain('src/plugin/index.ts')

    expect(readmeContent).toContain(
      'docs/integration/emdash-local-validation.md',
    )
    expect(readmeContent).toContain(
      'The root package exports a native EmDash descriptor plus a named `createPlugin()` factory.',
    )
    expect(readmeContent).toContain(
      'Run `pnpm build` when you need refreshed package artifacts for EmDash local-host consumption.',
    )
    expect(readmeContent).toContain(
      'relink or refresh the same local dependency if EmDash still sees stale artifacts',
    )
    expect(readmeContent).toContain('Optional Docker wrapper:')
  })
})
