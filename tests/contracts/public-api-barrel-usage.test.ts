import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('production barrel usage', () => {
  it('uses relative source imports instead of internal aliases in public host entries', () => {
    const source = readFileSync('src/plugin/pages/editor-page.tsx', 'utf8')

    expect(source).toContain('../../admin/index.js')
    expect(source).not.toContain('@emcanvas/admin')
  })
})
