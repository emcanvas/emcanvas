import { describe, expect, it } from 'vitest'
import readmeContent from '../../README.md?raw'
import checklistContent from '../../docs/integration/emdash-consumable-package-checklist.md?raw'
import devSourceGuideContent from '../../docs/integration/emdash-dev-source-consumption.md?raw'

describe('consumable package docs', () => {
  it('documents the runtime package checklist', () => {
    expect(checklistContent).toContain('## Consumable package checklist')
    expect(checklistContent).toContain(
      '- Package exports point to `dist` runtime artifacts.',
    )
    expect(checklistContent).toContain(
      '- The native plugin descriptor resolves `entrypoint`, `sandbox`, `adminEntry`, and `componentsEntry` from the published package specifiers.',
    )
    expect(checklistContent).toContain(
      '- EmDash can import the root and sandbox surfaces from the local package.',
    )
    expect(checklistContent).toContain(
      '- Admin and astro surfaces stay explicit and host-focused.',
    )
  })

  it('defines one canonical local path contract backed by dist artifacts', () => {
    expect(checklistContent).toContain(
      '- Use one canonical local dependency: point EmDash at the EmCanvas repo root/worktree package path.',
    )
    expect(checklistContent).toContain(
      '- Rebuild the package with `pnpm build` before asking EmDash to consume refreshed local artifacts.',
    )
    expect(checklistContent).toContain(
      '- The canonical package exports stay backed by `./dist/index.mjs`, `./dist/sandbox-entry.mjs`, `./dist/admin.mjs`, and `./dist/astro.mjs`.',
    )
    expect(checklistContent).not.toContain('npm link')
  })

  it('documents dev-source mode as an explicit local-only opt-in alongside canonical dist consumption', () => {
    expect(readmeContent).toContain('## Test from source')
    expect(readmeContent).toContain(
      'The packaged `file:`/`dist` workflow is the canonical release and local-host contract.',
    )
    expect(readmeContent).toContain(
      '### Optional: dev-source mode for local EmDash hosts',
    )
    expect(readmeContent).toContain(
      'Dev-source mode is opt-in for local development only and does not replace packaged `dist` consumption.',
    )

    expect(devSourceGuideContent).toContain('# EmDash dev-source consumption')
    expect(devSourceGuideContent).toContain(
      '- Keep packaged `dist/*` consumption as the canonical release contract.',
    )
    expect(devSourceGuideContent).toContain(
      '- Use the `@emcanvas/plugin` alias namespace and mirror it in the local EmDash host Vite config.',
    )
    expect(devSourceGuideContent).toContain(
      '- This workflow is for local EmDash hosts only and does not require EmDash upstream changes.',
    )
    expect(devSourceGuideContent).toContain('```ts')
    expect(devSourceGuideContent).toContain("'@emcanvas/plugin':")
  })
})
