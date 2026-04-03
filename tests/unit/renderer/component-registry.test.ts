import { describe, expect, it } from 'vitest'
import { getComponentRenderer } from '../../../src/renderer/components/registry'

describe('getComponentRenderer', () => {
  it('returns render models with explicit category and tag semantics', () => {
    const model = getComponentRenderer('section')({
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    })

    expect(model.category).toBe('wrapper')
    expect(model.tag).toBe('section')
  })

  it('returns heading leaf models using tag as the only heading semantic', () => {
    const model = getComponentRenderer('heading')({
      id: 'heading-1',
      type: 'heading',
      props: { text: 'Title', level: 4 },
      styles: { desktop: {} },
      children: [],
    })

    expect(model).toEqual({
      category: 'leaf',
      kind: 'heading',
      tag: 'h4',
      text: 'Title',
    })
  })

  it('throws for unsupported node types', () => {
    expect(() => getComponentRenderer('carousel')).toThrowError("Unsupported canvas node type: carousel")
  })
})
