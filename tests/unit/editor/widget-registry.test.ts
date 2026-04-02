import { describe, expect, it } from 'vitest'

import { WIDGET_CATEGORIES } from '../../../src/editor/registry/categories'
import { widgetRegistry } from '../../../src/editor/registry/widget-registry'

describe('widgetRegistry', () => {
  it('contains the 10 MVP widgets', () => {
    expect(widgetRegistry.size).toBe(10)
    expect(widgetRegistry.has('section')).toBe(true)
    expect(widgetRegistry.has('video')).toBe(true)
  })

  it('keeps widget definitions declarative', () => {
    const section = widgetRegistry.get('section')
    const heading = widgetRegistry.get('heading')
    const image = widgetRegistry.get('image')

    expect(section).toMatchObject({
      type: 'section',
      label: 'Section',
      category: WIDGET_CATEGORIES.layout,
      defaultProps: {},
      allowedChildren: 'any',
    })

    expect(heading).toMatchObject({
      type: 'heading',
      category: WIDGET_CATEGORIES.content,
      allowedChildren: 'none',
    })

    expect(image).toMatchObject({
      type: 'image',
      category: WIDGET_CATEGORIES.media,
      allowedChildren: 'none',
    })
  })
})
