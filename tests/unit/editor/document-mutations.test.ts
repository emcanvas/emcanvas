import { describe, expect, it } from 'vitest'

import type {
  CanvasDocument,
  CanvasNode,
} from '../../../src/foundation/types/canvas'
import {
  deleteNode,
  insertChildNode,
  insertNodeBelow,
  resolveSelectionAfterDelete,
} from '../../../src/editor/model/document-mutations'
import {
  createWidgetRegistry,
  widgetRegistry,
} from '../../../src/editor/registry/widget-registry'

function createFixtureDocument(): CanvasDocument {
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
          children: [],
        },
        {
          id: 'heading-1',
          type: 'heading',
          props: { text: 'Title', level: 2 },
          styles: { desktop: {} },
          children: [],
        },
      ],
    },
    settings: {},
  }
}

function createNode(overrides: Partial<CanvasNode> = {}): CanvasNode {
  return {
    id: 'node-1',
    type: 'heading',
    props: {},
    styles: { desktop: {} },
    children: [],
    ...overrides,
  }
}

describe('insertChildNode', () => {
  it('adds a child node under a valid parent', () => {
    const document = createFixtureDocument()

    const result = insertChildNode(
      document,
      'root',
      createNode({ id: 'n1' }),
      widgetRegistry,
    )

    expect(result.root.children).toHaveLength(3)
    expect(result.root.children?.[2]).toMatchObject({
      id: 'n1',
      type: 'heading',
    })
  })

  it('returns a new document without mutating the original tree', () => {
    const document = createFixtureDocument()

    const result = insertChildNode(
      document,
      'columns-1',
      createNode({ id: 'container-1', type: 'container' }),
      widgetRegistry,
    )

    expect(result).not.toBe(document)
    expect(result.root).not.toBe(document.root)
    expect(result.root.children?.[0]).not.toBe(document.root.children?.[0])
    expect(result.root.children?.[1]).toBe(document.root.children?.[1])
    expect(document.root.children?.[0]?.children).toEqual([])
    expect(result.root.children?.[0]?.children).toEqual([
      expect.objectContaining({ id: 'container-1', type: 'container' }),
    ])
  })

  it('throws when the parent node does not exist', () => {
    const document = createFixtureDocument()

    expect(() =>
      insertChildNode(document, 'missing-parent', createNode(), widgetRegistry),
    ).toThrow("Cannot find node 'missing-parent'")
  })

  it('throws when the parent widget does not allow the child type', () => {
    const document = createFixtureDocument()

    expect(() =>
      insertChildNode(
        document,
        'heading-1',
        createNode({ id: 'nested-heading', type: 'heading' }),
        widgetRegistry,
      ),
    ).toThrow("Node 'heading-1' of type 'heading' cannot accept children")
  })

  it('throws when the child widget type is not allowed by the parent widget', () => {
    const document = createFixtureDocument()

    expect(() =>
      insertChildNode(
        document,
        'columns-1',
        createNode({ id: 'bad-child', type: 'heading' }),
        widgetRegistry,
      ),
    ).toThrow(
      "Node 'columns-1' of type 'columns' only accepts children of type: container",
    )
  })

  it('throws when an inserted subtree contains a descendant id already present in the document', () => {
    const document = createFixtureDocument()
    const subtree = createNode({
      id: 'container-1',
      type: 'container',
      children: [createNode({ id: 'heading-1', type: 'heading' })],
    })

    expect(() =>
      insertChildNode(document, 'root', subtree, widgetRegistry),
    ).toThrow("Node id 'heading-1' already exists")
  })

  it('throws when an inserted subtree contains duplicate ids internally', () => {
    const document = createFixtureDocument()
    const subtree = createNode({
      id: 'container-1',
      type: 'container',
      children: [
        createNode({ id: 'duplicate-id', type: 'heading' }),
        createNode({ id: 'duplicate-id', type: 'heading' }),
      ],
    })

    expect(() =>
      insertChildNode(document, 'root', subtree, widgetRegistry),
    ).toThrow("Node id 'duplicate-id' is duplicated in inserted subtree")
  })
})

describe('insertNodeBelow', () => {
  it('inserts a sibling immediately after the selected node', () => {
    const document = createFixtureDocument()

    const result = insertNodeBelow(
      document,
      'columns-1',
      createNode({ id: 'text-1', type: 'text' }),
      widgetRegistry,
    )

    expect(result.root.children?.map((node) => node.id)).toEqual([
      'columns-1',
      'text-1',
      'heading-1',
    ])
  })

  it('appends into the root when inserting below the root node', () => {
    const document = createFixtureDocument()

    const result = insertNodeBelow(
      document,
      'root',
      createNode({ id: 'text-1', type: 'text' }),
      widgetRegistry,
    )

    expect(result.root.children?.map((node) => node.id)).toEqual([
      'columns-1',
      'heading-1',
      'text-1',
    ])
  })
})

describe('deleteNode', () => {
  it('removes the selected node from the document tree', () => {
    const document = createFixtureDocument()

    const result = deleteNode(document, 'heading-1')

    expect(result.root.children?.map((node) => node.id)).toEqual(['columns-1'])
  })

  it('throws when deleting the root node', () => {
    const document = createFixtureDocument()

    expect(() => deleteNode(document, 'root')).toThrow(
      'Cannot remove the root node',
    )
  })
})

describe('resolveSelectionAfterDelete', () => {
  it('prefers the previous sibling after deleting a node with siblings', () => {
    const document = createFixtureDocument()

    expect(resolveSelectionAfterDelete(document, 'heading-1')).toBe('columns-1')
  })

  it('clears the selection when deleting the last root block', () => {
    const document = createFixtureDocument()
    document.root.children = [createNode({ id: 'heading-1', type: 'heading' })]

    expect(resolveSelectionAfterDelete(document, 'heading-1')).toBeNull()
  })
})

describe('alternative registry validation', () => {
  it('supports custom registry semantics in tests without mutating the global singleton', () => {
    const document = createFixtureDocument()
    const nestedHeading = createNode({ id: 'nested-heading', type: 'heading' })
    const customRegistry = createWidgetRegistry([
      {
        type: 'section',
        label: 'Section',
        category: 'layout',
        defaultProps: {},
        propSchema: [],
        allowedChildren: 'any',
        disableBaseWrapper: false,
      },
      {
        type: 'columns',
        label: 'Columns',
        category: 'layout',
        defaultProps: { columns: 2 },
        propSchema: [],
        allowedChildren: [],
        disableBaseWrapper: false,
      },
      {
        type: 'heading',
        label: 'Heading',
        category: 'content',
        defaultProps: { text: 'Heading', level: 2 },
        propSchema: [],
        allowedChildren: ['heading'],
        disableBaseWrapper: false,
      },
    ])

    expect(() =>
      insertChildNode(document, 'heading-1', nestedHeading, widgetRegistry),
    ).toThrow("Node 'heading-1' of type 'heading' cannot accept children")

    const result = insertChildNode(
      document,
      'heading-1',
      nestedHeading,
      customRegistry,
    )

    expect(result.root.children?.[1]).toMatchObject({
      id: 'heading-1',
      children: [
        expect.objectContaining({ id: 'nested-heading', type: 'heading' }),
      ],
    })
    expect(document.root.children?.[1]?.children).toEqual([])
  })
})
