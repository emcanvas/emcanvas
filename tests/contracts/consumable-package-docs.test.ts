import { describe, expect, it } from 'vitest'
import checklistContent from '../../docs/integration/emdash-consumable-package-checklist.md?raw'

describe('consumable package docs', () => {
  it('documents the runtime package checklist', () => {
    expect(checklistContent).toContain('## Consumable package checklist')
    expect(checklistContent).toContain(
      '- Package exports point to `dist` runtime artifacts.',
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
})
