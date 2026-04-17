import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

describe('path alias usage', () => {
  it('keeps public host-facing plugin branches free from internal aliases', () => {
    const pluginSource = readFileSync(
      'src/plugin/runtime/create-plugin-definition.ts',
      'utf8',
    )
    const editorPageSource = readFileSync(
      'src/plugin/pages/editor-page.tsx',
      'utf8',
    )
    const editorShellSource = readFileSync(
      'src/editor/shell/editor-shell.tsx',
      'utf8',
    )

    expect(pluginSource).not.toContain('@emcanvas/')
    expect(editorPageSource).not.toContain('@emcanvas/')
    expect(editorShellSource).not.toContain('@emcanvas/')
  })
})
