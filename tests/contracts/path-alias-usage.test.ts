import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

describe('path alias usage', () => {
  it('migrates the selected production slice away from deep relative imports', () => {
    const editorSource = readFileSync('src/editor/shell/editor-shell.tsx', 'utf8')
    const rendererSource = readFileSync('src/renderer/data/normalize-canvas-document.ts', 'utf8')
    const pluginSource = readFileSync('src/plugin/runtime/create-plugin-definition.ts', 'utf8')

    expect(editorSource).toContain('@emcanvas/editor/')
    expect(editorSource).not.toContain("../../foundation/")

    expect(rendererSource).toContain('@emcanvas/renderer/')
    expect(rendererSource).not.toContain("../../foundation/")

    expect(pluginSource).toContain('@emcanvas/plugin/')
    expect(pluginSource).not.toContain("../admin-entry")
    expect(pluginSource).not.toContain("./create-runtime-plugin-definition")
  })
})
