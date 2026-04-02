import { describe, expect, it } from 'vitest'
import { isCanvasDocument } from '../../../src/foundation/model/guards'

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
})
