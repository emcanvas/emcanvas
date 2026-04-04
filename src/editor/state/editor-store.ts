import { createSnapshotHistoryStore } from './snapshot-history-store'
import { createSelectionStore } from './selection-store'

export type EditorBreakpoint = 'desktop' | 'tablet' | 'mobile'

export interface EditorState {
  selectedNodeId: string | null
  dirty: boolean
  breakpoint: EditorBreakpoint
  canUndo: boolean
  canRedo: boolean
}

type Listener = () => void

export interface EditorStore<T extends NonNullable<unknown>> {
  selectNode(nodeId: string): void
  clearSelection(): void
  markDirty(): void
  markClean(): void
  setBreakpoint(nextBreakpoint: EditorBreakpoint): void
  resetHistory(snapshot: T): void
  pushHistory(snapshot: T): void
  undoHistory(): T | null
  redoHistory(): T | null
  getState(): EditorState
  subscribe(listener: Listener): () => void
}

export function createEditorStore<T extends NonNullable<unknown>>(): EditorStore<T> {
  const selectionStore = createSelectionStore()
  const historyStore = createSnapshotHistoryStore<T>()
  let dirty = false
  let breakpoint: EditorBreakpoint = 'desktop'
  const listeners = new Set<Listener>()

  function createStateSnapshot(): EditorState {
    const selection = selectionStore.getState()
    const history = historyStore.getState()

    return {
      selectedNodeId: selection.selectedNodeId,
      dirty,
      breakpoint,
      canUndo: history.canUndo,
      canRedo: history.canRedo,
    }
  }

  let state = createStateSnapshot()

  function notify() {
    state = createStateSnapshot()
    listeners.forEach((listener) => listener())
  }

  function getState(): EditorState {
    return state
  }

  return {
    selectNode(nodeId: string) {
      selectionStore.selectNode(nodeId)
      notify()
    },
    clearSelection() {
      selectionStore.clearSelection()
      notify()
    },
    markDirty() {
      dirty = true
      notify()
    },
    markClean() {
      dirty = false
      notify()
    },
    setBreakpoint(nextBreakpoint: EditorBreakpoint) {
      breakpoint = nextBreakpoint
      notify()
    },
    resetHistory(snapshot: T) {
      historyStore.reset(snapshot)
      notify()
    },
    pushHistory(snapshot: T) {
      historyStore.push(snapshot)
      notify()
    },
    undoHistory() {
      const snapshot = historyStore.undo()
      notify()

      return snapshot
    },
    redoHistory() {
      const snapshot = historyStore.redo()
      notify()

      return snapshot
    },
    getState,
    subscribe(listener: Listener) {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
  }
}
