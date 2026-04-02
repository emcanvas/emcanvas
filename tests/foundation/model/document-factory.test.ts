import { describe, expect, it } from 'vitest'
import { createDefaultCanvasDocument } from '../../../src/foundation/model/document-factory'

describe('createDefaultCanvasDocument', () => {
  it('creates a version 1 document with a root node', () => {
    const doc = createDefaultCanvasDocument()

    expect(doc.version).toBe(1)
    expect(doc.root.id).toBeTruthy()
    expect(doc.root.type).toBe('section')
    expect(doc.root.props).toEqual({})
    expect(doc.root.styles).toEqual({ desktop: {} })
    expect(doc.root.children).toEqual([])
    expect(doc.settings).toEqual({})
  })

  it('creates a unique root id for each document', () => {
    const firstDoc = createDefaultCanvasDocument()
    const secondDoc = createDefaultCanvasDocument()

    expect(firstDoc.root.id).not.toBe(secondDoc.root.id)
  })
})
