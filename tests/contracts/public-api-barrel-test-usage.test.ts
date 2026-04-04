import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('test barrel usage', () => {
  it('uses layer barrels in the selected test slice', () => {
    const source = readFileSync('tests/integration/plugin-admin-mount.test.tsx', 'utf8')

    expect(source).toContain('@emcanvas/admin')
  })
})
