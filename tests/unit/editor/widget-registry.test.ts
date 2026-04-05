import { describe, expect, expectTypeOf, it } from 'vitest'

import { WIDGET_CATEGORIES } from '../../../src/editor/registry/categories'
import type { WidgetDefinition, WidgetPropSchemaItem } from '../../../src/editor/registry/widget-definition'
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

  it('enforces a minimal contract for prop schema items', () => {
    const heading = widgetRegistry.get('heading')

    expect(heading?.propSchema).toEqual([
      {
        key: 'text',
        type: 'string',
      },
      {
        key: 'level',
        type: 'number',
        min: 1,
        max: 6,
      },
    ])

    expectTypeOf<WidgetPropSchemaItem>().toMatchTypeOf<{
      key: string
      type: string
      label?: string
      min?: number
      max?: number
    }>()

    expectTypeOf<WidgetDefinition['propSchema'][number]>().toEqualTypeOf<WidgetPropSchemaItem>()
  })

  it('makes base wrapper participation explicit for every widget', () => {
    for (const definition of widgetRegistry.values()) {
      expect(definition).toHaveProperty('disableBaseWrapper')
      expectTypeOf(definition.disableBaseWrapper).toEqualTypeOf<boolean | undefined>()
    }
  })

  it('throws when two widgets share the same type', async () => {
    await expect(
      import('../../../src/editor/registry/widget-registry').then(({ createWidgetRegistry }) =>
        createWidgetRegistry([
          {
            type: 'duplicate',
            label: 'First',
            category: WIDGET_CATEGORIES.content,
            defaultProps: {},
            propSchema: [],
            allowedChildren: 'none',
          },
          {
            type: 'duplicate',
            label: 'Second',
            category: WIDGET_CATEGORIES.content,
            defaultProps: {},
            propSchema: [],
            allowedChildren: 'none',
          },
        ]),
      ),
    ).rejects.toThrow("Duplicate widget type: 'duplicate'")
  })
})
