import { describe, expect, it } from 'vitest'

import { createEditorStore } from '../../../src/editor/state/editor-store'
import { createHistoryStore } from '../../../src/editor/state/history-store'
import { createSnapshotHistoryStore } from '../../../src/editor/state/snapshot-history-store'
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

  it('keeps previously observed snapshots stable after later selection changes', () => {
    const store = createSelectionStore()

    store.selectNode('root')

    const snapshot = store.getState()
    store.clearSelection()

    expect(snapshot.selectedNodeId).toBe('root')
    expect(store.getState().selectedNodeId).toBeNull()
  })
})

describe('history store', () => {
  it('tracks command undo and redo state', () => {
    const store = createHistoryStore()
    let count = 0

    const command = {
      execute() {
        count += 1
      },
      undo() {
        count -= 1
      },
    }

    expect(store.getState()).toMatchObject({
      canUndo: false,
      canRedo: false,
    })

    store.execute(command)

    expect(count).toBe(1)
    expect(store.getState()).toMatchObject({
      canUndo: true,
      canRedo: false,
    })

    store.undo()

    expect(count).toBe(0)
    expect(store.getState()).toMatchObject({
      canUndo: false,
      canRedo: true,
    })

    store.redo()

    expect(count).toBe(1)
    expect(store.getState()).toMatchObject({
      canUndo: true,
      canRedo: false,
    })
  })
})

describe('snapshot history store', () => {
  it('tracks present state and supports undo/redo', () => {
    const store = createSnapshotHistoryStore<string>()

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
    const store = createSnapshotHistoryStore<string>()

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

  it('keeps previously observed history snapshots stable after later transitions', () => {
    const store = createSnapshotHistoryStore<string>()

    store.push('doc-1')
    store.push('doc-2')
    store.undo()

    const snapshot = store.getState()
    store.redo()

    expect(snapshot).toMatchObject({
      past: [],
      present: 'doc-1',
      future: ['doc-2'],
      canUndo: false,
      canRedo: true,
    })

    expect(store.getState()).toMatchObject({
      past: ['doc-1'],
      present: 'doc-2',
      future: [],
      canUndo: true,
      canRedo: false,
    })
  })

  it('returns null when undo and redo are unavailable', () => {
    const store = createSnapshotHistoryStore<string>()

    expect(store.undo()).toBeNull()
    expect(store.redo()).toBeNull()
    expect(store.getState()).toMatchObject({
      present: null,
      canUndo: false,
      canRedo: false,
    })
  })
})

describe('editor store', () => {
  it('returns null when undo and redo history are unavailable', () => {
    const store = createEditorStore<string>()

    expect(store.undoHistory()).toBeNull()
    expect(store.redoHistory()).toBeNull()
    expect(store.getState()).toMatchObject({
      canUndo: false,
      canRedo: false,
    })
  })

  it('restores the history snapshot selection across undo and redo', () => {
    const store = createEditorStore<string>()

    store.pushHistory('doc-1', 'heading-1')
    store.pushHistory('doc-2', 'button-1')

    expect(store.undoHistory()).toEqual({
      snapshot: 'doc-1',
      selectedNodeId: 'heading-1',
    })
    expect(store.getState()).toMatchObject({
      canUndo: false,
      canRedo: true,
    })

    expect(store.redoHistory()).toEqual({
      snapshot: 'doc-2',
      selectedNodeId: 'button-1',
    })
    expect(store.getState()).toMatchObject({
      canUndo: true,
      canRedo: false,
    })
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

    expect(store.undoHistory()).toEqual({
      snapshot: 'doc-1',
      selectedNodeId: null,
    })
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

  it('returns to clean when history reaches the persisted snapshot again', () => {
    const store = createEditorStore<string>()

    store.resetHistory('doc-1')

    expect(store.getState().dirty).toBe(false)

    store.pushHistory('doc-2')
    expect(store.getState()).toMatchObject({
      dirty: true,
      canUndo: true,
      canRedo: false,
    })

    expect(store.undoHistory()).toEqual({
      snapshot: 'doc-1',
      selectedNodeId: null,
    })
    expect(store.getState()).toMatchObject({
      dirty: false,
      canUndo: false,
      canRedo: true,
    })

    expect(store.redoHistory()).toEqual({
      snapshot: 'doc-2',
      selectedNodeId: null,
    })
    expect(store.getState().dirty).toBe(true)

    store.markClean()
    expect(store.getState().dirty).toBe(false)

    expect(store.undoHistory()).toEqual({
      snapshot: 'doc-1',
      selectedNodeId: null,
    })
    expect(store.getState().dirty).toBe(true)

    expect(store.redoHistory()).toEqual({
      snapshot: 'doc-2',
      selectedNodeId: null,
    })
    expect(store.getState().dirty).toBe(false)
  })
})
