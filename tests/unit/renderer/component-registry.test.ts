import { describe, expect, it } from 'vitest'
import { getAstroComponent } from '../../../src/renderer/components/registry'

describe('astro component registry', () => {
  it('resolves a renderer component from node.type', () => {
    expect(getAstroComponent('Heading')).toBeTypeOf('function')
  })

  it('rejects non-canonical type names', () => {
    expect(() => getAstroComponent('heading')).toThrowError('Unsupported canvas node type: heading')
  })
})
