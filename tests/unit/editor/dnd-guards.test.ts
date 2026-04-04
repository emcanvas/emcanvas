import { describe, expect, it } from 'vitest'

import type { CanvasDocument, CanvasNode } from '../../../src/foundation/types/canvas'
import { canDropPayload, parseDndPayload } from '../../../src/editor/dnd/dnd-guards'

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
          id: 'container-1',
          type: 'container',
          props: {},
          styles: { desktop: {} },
          children: [createNodeFixture({ id: 'heading-1' })],
        },
        {
          id: 'columns-1',
          type: 'columns',
          props: { columns: 2 },
          styles: { desktop: {} },
          children: [
            {
              id: 'container-2',
              type: 'container',
              props: {},
              styles: { desktop: {} },
              children: [],
            },
          ],
        },
      ],
    },
    settings: {},
  }
}

describe('parseDndPayload', () => {
  it('parses valid create and move payloads', () => {
    expect(parseDndPayload('{"kind":"create","nodeType":"text"}')).toEqual({
      kind: 'create',
      nodeType: 'text',
    })
    expect(parseDndPayload('{"kind":"move","nodeId":"heading-1"}')).toEqual({
      kind: 'move',
      nodeId: 'heading-1',
    })
  })

  it('returns null for malformed or unsupported payloads', () => {
    expect(parseDndPayload('')).toBeNull()
    expect(parseDndPayload('{bad json')).toBeNull()
    expect(parseDndPayload('null')).toBeNull()
    expect(parseDndPayload('[]')).toBeNull()
    expect(parseDndPayload('"text"')).toBeNull()
    expect(parseDndPayload('{"kind":"create"}')).toBeNull()
    expect(parseDndPayload('{"kind":"move","nodeType":"text"}')).toBeNull()
    expect(parseDndPayload('{"kind":"other"}')).toBeNull()
  })
})

describe('canDropPayload', () => {
  it('returns true when a create payload can be inserted under the target parent', () => {
    const document = createFixtureDocument()

    expect(canDropPayload(document, { kind: 'create', nodeType: 'text' }, 'container-1')).toBe(true)
  })

  it('returns true when a move payload can be applied to the target parent', () => {
    const document = createFixtureDocument()

    expect(canDropPayload(document, { kind: 'move', nodeId: 'heading-1' }, 'container-2')).toBe(true)
  })

  it('returns false when the requested drop would violate document rules', () => {
    const document = createFixtureDocument()

    expect(canDropPayload(document, { kind: 'create', nodeType: 'heading' }, 'heading-1')).toBe(false)
    expect(canDropPayload(document, { kind: 'move', nodeId: 'container-1' }, 'heading-1')).toBe(false)
    expect(canDropPayload(document, { kind: 'move', nodeId: 'root' }, 'container-2')).toBe(false)
  })
})
