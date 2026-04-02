import { describe, expect, it } from 'vitest'
import { getComponentRenderer } from '../../../src/renderer/components/registry'

describe('getComponentRenderer', () => {
  it('throws for unsupported node types', () => {
    expect(() => getComponentRenderer('carousel')).toThrowError("Unsupported canvas node type: carousel")
  })
})
