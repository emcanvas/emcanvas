import { describe, expect, it } from 'vitest'
import { getAstroComponent } from '../../../src/renderer/components/registry'

describe('astro component registry', () => {
  it('resolves a renderer component from node.type', () => {
    expect(getAstroComponent('heading')).toBeTypeOf('function')
    expect(getAstroComponent('text')).toBeTypeOf('function')
    expect(getAstroComponent('button')).toBeTypeOf('function')
  })

  it('rejects non-canonical type names', () => {
    expect(() => getAstroComponent('Heading')).toThrowError('Unsupported canvas node type: Heading')
  })
})
