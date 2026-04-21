import { describe, expect, it } from 'vitest'

import { updateNodeProps } from '../../../src/editor/commands/update-props-command'
import type { CanvasDocument } from '../../../src/foundation/types/canvas'

function createColumnsDocument(
  children: CanvasDocument['root']['children'] = [],
) {
  return {
    version: 1,
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [
        {
          id: 'columns-1',
          type: 'columns',
          props: { columns: 2 },
          styles: { desktop: {} },
          children,
        },
      ],
    },
    settings: {},
  } satisfies CanvasDocument
}

describe('updateNodeProps', () => {
  it('adds missing default containers when columns count grows', () => {
    const document = createColumnsDocument([
      {
        id: 'container-1',
        type: 'container',
        props: {},
        styles: { desktop: {} },
        children: [],
      },
      {
        id: 'container-2',
        type: 'container',
        props: {},
        styles: { desktop: {} },
        children: [],
      },
    ])

    const nextDocument = updateNodeProps(document, 'columns-1', { columns: 3 })
    const columnsNode = nextDocument.root.children?.[0]

    expect(columnsNode?.props.columns).toBe(3)
    expect(columnsNode?.children).toHaveLength(3)
    expect(columnsNode?.children?.slice(0, 2).map((child) => child.id)).toEqual(
      ['container-1', 'container-2'],
    )
    expect(columnsNode?.children?.[2]).toMatchObject({
      type: 'container',
      props: {},
      children: [],
    })
  })

  it('does not shrink columns below existing populated containers', () => {
    const document = createColumnsDocument([
      {
        id: 'container-1',
        type: 'container',
        props: {},
        styles: { desktop: {} },
        children: [],
      },
      {
        id: 'container-2',
        type: 'container',
        props: {},
        styles: { desktop: {} },
        children: [],
      },
      {
        id: 'container-3',
        type: 'container',
        props: {},
        styles: { desktop: {} },
        children: [
          {
            id: 'heading-1',
            type: 'heading',
            props: { text: 'Nested heading', level: 2 },
            styles: { desktop: {} },
            children: [],
          },
        ],
      },
    ])

    const nextDocument = updateNodeProps(document, 'columns-1', { columns: 2 })
    const columnsNode = nextDocument.root.children?.[0]

    expect(columnsNode?.props.columns).toBe(3)
    expect(columnsNode?.children).toHaveLength(3)
    expect(columnsNode?.children?.[2]?.children?.[0]).toMatchObject({
      type: 'heading',
      props: { text: 'Nested heading', level: 2 },
    })
  })
})
