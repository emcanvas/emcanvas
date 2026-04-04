import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('production barrel usage', () => {
  it('uses layer barrels in the selected production slice', () => {
    const source = readFileSync('src/plugin/pages/editor-page.tsx', 'utf8')

    expect(source).toContain('@emcanvas/admin')
  })
})
