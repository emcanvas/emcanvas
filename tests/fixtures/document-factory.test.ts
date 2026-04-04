import { describe, expect, it } from 'vitest'

import { createFixtureDocument } from './document-factory'

describe('createFixtureDocument', () => {
  it('creates the shared default document fixture with fresh nested state', () => {
    const firstDocument = createFixtureDocument()
    const secondDocument = createFixtureDocument()

    expect(firstDocument).toEqual({
      version: 1,
      root: {
        id: 'root',
        type: 'section',
        props: {},
        styles: { desktop: {} },
        children: [],
      },
      settings: {},
    })
    expect(secondDocument).toEqual(firstDocument)
    expect(secondDocument).not.toBe(firstDocument)
    expect(secondDocument.root).not.toBe(firstDocument.root)
    expect(secondDocument.root.children).not.toBe(firstDocument.root.children)
  })
})
