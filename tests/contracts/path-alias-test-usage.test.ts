import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

describe('test alias usage', () => {
  it('uses aliases in the selected tests', () => {
    const source = readFileSync('tests/integration/editor-shell-flow.test.tsx', 'utf8')

    expect(source).toContain('@emcanvas/')
  })
})
