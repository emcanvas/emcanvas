import { describe, expect, it } from 'vitest'
import checklistContent from '../../docs/integration/emdash-consumable-package-checklist.md?raw'

describe('consumable package docs', () => {
  it('documents the runtime package checklist', () => {
    expect(checklistContent).toContain('## Consumable package checklist')
    expect(checklistContent).toContain('- Package exports point to `dist` runtime artifacts.')
    expect(checklistContent).toContain('- EmDash can import the root and sandbox surfaces from the local package.')
    expect(checklistContent).toContain('- Admin and astro surfaces stay explicit and host-focused.')
  })
})
