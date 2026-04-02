import { describe, expect, it } from 'vitest'

import { createEditorStore } from '../../../src/editor/state/editor-store'
import { createHistoryStore } from '../../../src/editor/state/history-store'
import { createSelectionStore } from '../../../src/editor/state/selection-store'

describe('selection store', () => {
  it('tracks and clears the selected node id', () => {
    const store = createSelectionStore()

    expect(store.getState().selectedNodeId).toBeNull()

    store.selectNode('root')
    expect(store.getState().selectedNodeId).toBe('root')

    store.clearSelection()
    expect(store.getState().selectedNodeId).toBeNull()
  })

  it('returns a snapshot that cannot mutate internal state', () => {
    const store = createSelectionStore()

    store.selectNode('root')

    const snapshot = store.getState()
    snapshot.selectedNodeId = 'other'

    expect(store.getState().selectedNodeId).toBe('root')
  })
})

describe('history store', () => {
  it('tracks present state and supports undo/redo', () => {
    const store = createHistoryStore<string>()

    store.push('doc-1')
    store.push('doc-2')

    expect(store.getState()).toMatchObject({
      present: 'doc-2',
      canUndo: true,
      canRedo: false,
    })

    expect(store.undo()).toBe('doc-1')
    expect(store.getState()).toMatchObject({
      present: 'doc-1',
      canUndo: false,
      canRedo: true,
    })

    expect(store.redo()).toBe('doc-2')
    expect(store.getState()).toMatchObject({
      present: 'doc-2',
      canUndo: true,
      canRedo: false,
    })
  })

  it('drops redo history when a new state is pushed after undo', () => {
    const store = createHistoryStore<string>()

    store.push('doc-1')
    store.push('doc-2')
    store.undo()

    store.push('doc-3')

    expect(store.getState()).toMatchObject({
      present: 'doc-3',
      canUndo: true,
      canRedo: false,
    })
    expect(store.redo()).toBeNull()
  })

  it('returns a snapshot that cannot mutate internal state', () => {
    const store = createHistoryStore<string>()

    store.push('doc-1')
    store.push('doc-2')
    store.undo()

    const snapshot = store.getState()
    snapshot.present = 'mutated'
    snapshot.past.push('mutated-past')
    snapshot.future.push('mutated-future')
    snapshot.canUndo = true
    snapshot.canRedo = false

    expect(store.getState()).toMatchObject({
      past: [],
      present: 'doc-1',
      future: ['doc-2'],
      canUndo: false,
      canRedo: true,
    })
  })

  it('rejects nullable snapshot types at compile time', () => {
    // @ts-expect-error history snapshots must be non-null
    createHistoryStore<string | null>()

    expect(true).toBe(true)
  })
})

describe('editor store', () => {
  it('rejects nullable snapshot types at compile time', () => {
    // @ts-expect-error editor snapshots must be non-null
    createEditorStore<string | null>()

    expect(true).toBe(true)
  })

  it('tracks selected node, dirty state, breakpoint, and history flags', () => {
    const store = createEditorStore<string>()

    expect(store.getState()).toMatchObject({
      selectedNodeId: null,
      dirty: false,
      breakpoint: 'desktop',
      canUndo: false,
      canRedo: false,
    })

    store.selectNode('root')
    store.markDirty()
    store.setBreakpoint('tablet')
    store.pushHistory('doc-1')
    store.pushHistory('doc-2')

    expect(store.getState()).toMatchObject({
      selectedNodeId: 'root',
      dirty: true,
      breakpoint: 'tablet',
      canUndo: true,
      canRedo: false,
    })

    expect(store.undoHistory()).toBe('doc-1')
    expect(store.getState()).toMatchObject({
      canUndo: false,
      canRedo: true,
    })

    store.clearSelection()
    store.markClean()

    expect(store.getState()).toMatchObject({
      selectedNodeId: null,
      dirty: false,
    })
  })
})
