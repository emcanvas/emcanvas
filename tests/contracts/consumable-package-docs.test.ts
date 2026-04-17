import { describe, expect, it } from 'vitest'
import readmeContent from '../../README.md?raw'
import checklistContent from '../../docs/integration/emdash-consumable-package-checklist.md?raw'
import devSourceGuideContent from '../../docs/integration/emdash-dev-source-consumption.md?raw'

describe('consumable package docs', () => {
  it('documents the runtime package checklist', () => {
    expect(checklistContent).toContain('## Consumable package checklist')
    expect(checklistContent).toContain(
      '- Package exports point to `src/plugin/*` entry modules for source-first host consumption.',
    )
    expect(checklistContent).toContain(
      '- The native plugin descriptor resolves `entrypoint`, `adminEntry`, `componentsEntry`, and `adminPages` from the published package specifiers.',
    )
    expect(checklistContent).toContain(
      '- EmDash can import the root runtime and descriptor surfaces from the local package.',
    )
    expect(checklistContent).toContain(
      '- Admin and astro surfaces stay explicit and host-focused.',
    )
  })

  it('defines one canonical local path contract backed by published package exports', () => {
    expect(checklistContent).toContain(
      '- Use one canonical local dependency: point EmDash at the EmCanvas repo root/worktree package path.',
    )
    expect(checklistContent).toContain(
      '- Local EmDash consumption resolves `emcanvas`, `emcanvas/descriptor`, `emcanvas/admin`, and `emcanvas/astro` through the package exports map.',
    )
    expect(checklistContent).toContain(
      '- Keep the package exports map aligned with the source-first `src/plugin/*` entry layout.',
    )
    expect(checklistContent).not.toContain('npm link')
  })

  it('documents source-first host consumption as the public local workflow', () => {
    expect(readmeContent).toContain('## Test from source')
    expect(readmeContent).toContain(
      'The canonical local-host contract is the source-first package surface.',
    )
    expect(readmeContent).toContain(
      'Import EmCanvas from the repo package path and let the public package specifiers resolve directly to source entry modules during local development.',
    )
    expect(readmeContent).not.toContain(
      '### Optional: dev-source mode for local EmDash hosts',
    )

    expect(devSourceGuideContent).toContain(
      '# EmDash local package consumption',
    )
    expect(devSourceGuideContent).toContain(
      '- Use the native `emcanvas` package specifiers as the only local host contract.',
    )
    expect(devSourceGuideContent).toContain(
      "import emcanvasPlugin, { createPlugin } from 'emcanvas'",
    )
    expect(devSourceGuideContent).toContain(
      "import descriptor from 'emcanvas/descriptor'",
    )
    expect(devSourceGuideContent).toContain(
      '- The package exports map must stay aligned with the source-first `src/plugin/*` runtime entry modules.',
    )
    expect(devSourceGuideContent).not.toContain('@emcanvas/plugin/dev-source')
  })
})
