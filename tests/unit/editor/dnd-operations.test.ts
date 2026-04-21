import { describe, expect, it } from 'vitest'

import type {
  CanvasDocument,
  CanvasNode,
} from '../../../src/foundation/types/canvas'
import {
  createNode,
  createNodeFromWidgetType,
  deleteNode,
  moveNode,
} from '../../../src/editor/dnd/dnd-operations'
import { validateInsertChildNode } from '../../../src/editor/model/document-validation'
import { validateInsertChildNodeWithWidgetRegistry } from '../../../src/editor/model/document-validation-registry'
import {
  createWidgetRegistry,
  widgetRegistry,
} from '../../../src/editor/registry/widget-registry'
import type { WidgetDefinition } from '../../../src/editor/registry/widget-definition'

function createNodeFixture(overrides: Partial<CanvasNode> = {}): CanvasNode {
  return {
    id: 'node-1',
    type: 'heading',
    props: {},
    styles: { desktop: {} },
    children: [],
    ...overrides,
  }
}

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
          children: [
            {
              id: 'container-1',
              type: 'container',
              props: {},
              styles: { desktop: {} },
              children: [
                createNodeFixture({
                  id: 'heading-1',
                  props: { text: 'Title', level: 2 },
                }),
              ],
            },
          ],
        },
        {
          id: 'container-2',
          type: 'container',
          props: {},
          styles: { desktop: {} },
          children: [
            createNodeFixture({
              id: 'heading-2',
              props: { text: 'Subtitle', level: 3 },
            }),
          ],
        },
      ],
    },
    settings: {},
  }
}

describe('createNodeFromWidgetType', () => {
  it('builds a new widget node from registry defaults', () => {
    const result = createNodeFromWidgetType('heading')

    expect(result).toMatchObject({
      type: 'heading',
      props: { text: 'Heading', level: 2 },
      styles: { desktop: {} },
      children: [],
    })
    expect(result.id).toMatch(/^heading-/)
  })

  it('builds columns with a minimal container subtree by default', () => {
    const result = createNodeFromWidgetType('columns')

    expect(result).toMatchObject({
      type: 'columns',
      props: { columns: 2 },
      styles: { desktop: {} },
      children: [
        {
          type: 'container',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
        {
          type: 'container',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
      ],
    })
    expect(result.id).toMatch(/^columns-/)
    expect(result.children).toHaveLength(2)
    expect(result.children?.[0]?.id).toMatch(/^container-/)
    expect(result.children?.[1]?.id).toMatch(/^container-/)
    expect(result.children?.[0]?.id).not.toBe(result.children?.[1]?.id)
  })

  it('throws when the widget type is unknown', () => {
    expect(() => createNodeFromWidgetType('missing-widget')).toThrow(
      "Unknown widget type: 'missing-widget'",
    )
  })
})

describe('createNode', () => {
  it('inserts a new registry-backed node under the requested parent', () => {
    const document = createFixtureDocument()

    const result = createNode(document, 'container-2', 'text')

    expect(result.root.children?.[1]?.children).toHaveLength(2)
    expect(result.root.children?.[1]?.children?.[1]).toMatchObject({
      type: 'text',
      props: { text: 'Lorem ipsum' },
      styles: { desktop: {} },
      children: [],
    })
    expect(document.root.children?.[1]?.children).toHaveLength(1)
  })
})

describe('deleteNode', () => {
  it('removes a nested node from the document tree', () => {
    const document = createFixtureDocument()

    const result = deleteNode(document, 'heading-1')

    expect(result.root.children?.[0]?.children?.[0]?.children).toEqual([])
    expect(document.root.children?.[0]?.children?.[0]?.children).toHaveLength(1)
  })

  it('throws when deleting the root node', () => {
    const document = createFixtureDocument()

    expect(() => deleteNode(document, 'root')).toThrow(
      'Cannot remove the root node',
    )
  })
})

describe('moveNode', () => {
  it('moves a node between valid parents without mutating the original tree', () => {
    const document = createFixtureDocument()

    const result = moveNode(document, 'heading-1', 'container-2')

    expect(result.root.children?.[0]?.children?.[0]?.children).toEqual([])
    expect(result.root.children?.[1]?.children).toEqual([
      expect.objectContaining({ id: 'heading-2' }),
      expect.objectContaining({ id: 'heading-1' }),
    ])
    expect(document.root.children?.[0]?.children?.[0]?.children).toEqual([
      expect.objectContaining({ id: 'heading-1' }),
    ])
  })

  it('keeps sibling targeting stable after removing the source node', () => {
    const document = createFixtureDocument()

    const result = moveNode(document, 'container-1', 'container-2')

    expect(result.root.children?.map((node) => node.id)).toEqual([
      'columns-1',
      'container-2',
    ])
    expect(result.root.children?.[0]?.children).toEqual([])
    expect(result.root.children?.[1]?.children).toEqual([
      expect.objectContaining({ id: 'heading-2' }),
      expect.objectContaining({ id: 'container-1' }),
    ])
  })

  it('treats moving a node to its current parent as a no-op even when siblings exist', () => {
    const document: CanvasDocument = {
      version: 1,
      root: {
        id: 'root',
        type: 'section',
        props: {},
        styles: { desktop: {} },
        children: [
          {
            id: 'container-1',
            type: 'container',
            props: {},
            styles: { desktop: {} },
            children: [
              createNodeFixture({ id: 'heading-1' }),
              createNodeFixture({ id: 'heading-2' }),
            ],
          },
        ],
      },
      settings: {},
    }

    const result = moveNode(document, 'heading-1', 'container-1')

    expect(result).toEqual(document)
  })

  it('rejects moving a node into one of its descendants', () => {
    const document = createFixtureDocument()

    expect(() => moveNode(document, 'columns-1', 'container-1')).toThrow(
      "Node 'columns-1' cannot be moved into its own descendant",
    )
  })
})

describe('document validation registry dependency', () => {
  it('does not require the global widget registry singleton to validate insertions', () => {
    const parent = createNodeFixture({ id: 'parent-1', type: 'custom-parent' })
    const child = createNodeFixture({ id: 'child-1', type: 'custom-child' })
    const registry = new Map<string, WidgetDefinition>([
      [
        'custom-parent',
        {
          type: 'custom-parent',
          label: 'Custom Parent',
          category: 'layout',
          defaultProps: {},
          propSchema: [],
          allowedChildren: ['custom-child'],
          disableBaseWrapper: false,
        },
      ],
      [
        'custom-child',
        {
          type: 'custom-child',
          label: 'Custom Child',
          category: 'content',
          defaultProps: {},
          propSchema: [],
          allowedChildren: 'none',
          disableBaseWrapper: false,
        },
      ],
    ])

    expect(() =>
      validateInsertChildNode(
        parent,
        child,
        createFixtureDocument().root,
        registry,
      ),
    ).not.toThrow()
  })

  it('keeps the default widget registry in a transitional adapter outside the core validator', () => {
    const document = createFixtureDocument()
    const parent = document.root.children?.[1]
    const child = createNodeFixture({
      id: 'text-1',
      type: 'text',
      props: { text: 'Body' },
    })

    expect(parent).toBeDefined()
    expect(() =>
      validateInsertChildNodeWithWidgetRegistry(parent!, child, document.root),
    ).not.toThrow()
  })
})

describe('alternative registry validation', () => {
  it('supports custom registry semantics in tests without mutating the global singleton', () => {
    const parent = createNodeFixture({ id: 'heading-parent', type: 'heading' })
    const child = createNodeFixture({ id: 'nested-heading', type: 'heading' })
    const customRegistry = createWidgetRegistry([
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
      validateInsertChildNode(
        parent,
        child,
        createFixtureDocument().root,
        widgetRegistry,
      ),
    ).toThrow("Node 'heading-parent' of type 'heading' cannot accept children")
    expect(() =>
      validateInsertChildNode(
        parent,
        child,
        createFixtureDocument().root,
        customRegistry,
      ),
    ).not.toThrow()
  })
})
