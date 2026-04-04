import { describe, expect, it } from 'vitest'

import type { CanvasNode } from '../../../src/foundation/types/canvas'
import { findNodePathById, getNodeAtPath, replaceNodeAtPath } from '../../../src/editor/shared/tree-path'

function createFixtureTree(): CanvasNode {
  return {
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
          {
            id: 'heading-1',
            type: 'heading',
            props: { text: 'Title' },
            styles: { desktop: {} },
            children: [],
          },
        ],
      },
      {
        id: 'text-1',
        type: 'text',
        props: { text: 'Body' },
        styles: { desktop: {} },
        children: [],
      },
    ],
  }
}

describe('findNodePathById', () => {
  it('returns tree paths for root, nested, and missing nodes', () => {
    const tree = createFixtureTree()

    expect(findNodePathById(tree, 'root')).toEqual([])
    expect(findNodePathById(tree, 'heading-1')).toEqual([0, 0])
    expect(findNodePathById(tree, 'missing')).toBeNull()
  })
})

describe('getNodeAtPath', () => {
  it('returns the node at a valid path and null for an invalid path', () => {
    const tree = createFixtureTree()

    expect(getNodeAtPath(tree, [1])).toMatchObject({ id: 'text-1', type: 'text' })
    expect(getNodeAtPath(tree, [0, 1])).toBeNull()
  })
})

describe('replaceNodeAtPath', () => {
  it('updates the targeted node while preserving untouched branches by reference', () => {
    const tree = createFixtureTree()

    const result = replaceNodeAtPath(tree, [0, 0], (node) => ({
      ...node,
      props: { ...node.props, text: 'Updated title' },
    }))

    expect(result).not.toBe(tree)
    expect(result.children?.[0]).not.toBe(tree.children?.[0])
    expect(result.children?.[1]).toBe(tree.children?.[1])
    expect(result.children?.[0]?.children?.[0]?.props).toEqual({ text: 'Updated title' })
    expect(tree.children?.[0]?.children?.[0]?.props).toEqual({ text: 'Title' })
  })

  it('throws when the path does not exist', () => {
    const tree = createFixtureTree()

    expect(() => replaceNodeAtPath(tree, [2], (node) => node)).toThrow('Invalid tree path: 2')
  })
})
