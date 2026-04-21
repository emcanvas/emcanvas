import { describe, expect, it } from 'vitest'
import {
  isCanvasDocument,
  isCanvasNode,
} from '../../../src/foundation/model/guards'

describe('canvas document shape', () => {
  it('accepts a minimal valid document', () => {
    expect(
      isCanvasDocument({
        version: 1,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
        settings: {},
      }),
    ).toBe(true)
  })

  it('accepts the default document shape', () => {
    expect(
      isCanvasDocument({
        version: 1,
        root: {
          id: 'node-1',
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
        settings: {},
      }),
    ).toBe(true)
  })

  it('rejects cyclic node input instead of recursing forever', () => {
    const node: Record<string, unknown> = {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    }

    node.children = [node]

    expect(isCanvasNode(node)).toBe(false)
  })

  it('rejects documents with non-json values in node props', () => {
    expect(
      isCanvasDocument({
        version: 1,
        root: {
          id: 'root',
          type: 'section',
          props: {
            onClick: () => 'boom',
          },
          styles: { desktop: {} },
          children: [],
        },
        settings: {},
      }),
    ).toBe(false)
  })
})
