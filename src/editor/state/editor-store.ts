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

export interface EditorHistorySnapshot<T> {
  snapshot: T
  selectedNodeId: string | null
}

type Listener = () => void

export interface EditorStore<T extends NonNullable<unknown>> {
  selectNode(nodeId: string): void
  clearSelection(): void
  markDirty(): void
  markClean(): void
  setBreakpoint(nextBreakpoint: EditorBreakpoint): void
  resetHistory(snapshot: T, selectedNodeId?: string | null): void
  pushHistory(snapshot: T, selectedNodeId?: string | null): void
  undoHistory(): EditorHistorySnapshot<T> | null
  redoHistory(): EditorHistorySnapshot<T> | null
  getState(): EditorState
  subscribe(listener: Listener): () => void
}

export function createEditorStore<
  T extends NonNullable<unknown>,
>(): EditorStore<T> {
  const selectionStore = createSelectionStore()
  const historyStore = createSnapshotHistoryStore<EditorHistorySnapshot<T>>()
  let dirty = false
  let cleanSnapshot: T | null = null
  let breakpoint: EditorBreakpoint = 'desktop'
  const listeners = new Set<Listener>()

  function syncDirtyWithHistory() {
    const present = historyStore.getState().present?.snapshot ?? null

    dirty = present !== cleanSnapshot
  }

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
      cleanSnapshot = historyStore.getState().present?.snapshot ?? null
      dirty = false
      notify()
    },
    setBreakpoint(nextBreakpoint: EditorBreakpoint) {
      breakpoint = nextBreakpoint
      notify()
    },
    resetHistory(snapshot: T, selectedNodeId: string | null = null) {
      historyStore.reset({ snapshot, selectedNodeId })
      cleanSnapshot = snapshot
      dirty = false
      notify()
    },
    pushHistory(snapshot: T, selectedNodeId: string | null = null) {
      historyStore.push({ snapshot, selectedNodeId })
      syncDirtyWithHistory()
      notify()
    },
    undoHistory() {
      const snapshot = historyStore.undo()
      syncDirtyWithHistory()
      notify()

      return snapshot
    },
    redoHistory() {
      const snapshot = historyStore.redo()
      syncDirtyWithHistory()
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
