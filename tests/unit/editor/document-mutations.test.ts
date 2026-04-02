import { describe, expect, it } from 'vitest'

import type { CanvasDocument, CanvasNode } from '../../../src/foundation/types/canvas'
import { insertChildNode } from '../../../src/editor/model/document-mutations'

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

    const result = insertChildNode(document, 'root', createNode({ id: 'n1' }))

    expect(result.root.children).toHaveLength(3)
    expect(result.root.children?.[2]).toMatchObject({ id: 'n1', type: 'heading' })
  })

  it('returns a new document without mutating the original tree', () => {
    const document = createFixtureDocument()

    const result = insertChildNode(document, 'columns-1', createNode({ id: 'container-1', type: 'container' }))

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

    expect(() => insertChildNode(document, 'missing-parent', createNode())).toThrow(
      "Cannot find node 'missing-parent'",
    )
  })

  it('throws when the parent widget does not allow the child type', () => {
    const document = createFixtureDocument()

    expect(() =>
      insertChildNode(document, 'heading-1', createNode({ id: 'nested-heading', type: 'heading' })),
    ).toThrow("Node 'heading-1' of type 'heading' cannot accept children")
  })

  it('throws when the child widget type is not allowed by the parent widget', () => {
    const document = createFixtureDocument()

    expect(() =>
      insertChildNode(document, 'columns-1', createNode({ id: 'bad-child', type: 'heading' })),
    ).toThrow("Node 'columns-1' of type 'columns' only accepts children of type: container")
  })
})
