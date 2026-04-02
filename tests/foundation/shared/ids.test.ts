import { describe, expect, it } from 'vitest'
import { createNodeId } from '../../../src/foundation/shared/ids'

describe('createNodeId', () => {
  it('does not depend on sequential global counter state', () => {
    const ids = Array.from({ length: 5 }, () => createNodeId())

    expect(new Set(ids).size).toBe(ids.length)

    for (const id of ids) {
      expect(id).toMatch(/^node-/)
      expect(id).not.toMatch(/^node-\d+$/)
    }
  })
})
