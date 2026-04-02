import { createHistoryStore } from './history-store'
import { createSelectionStore } from './selection-store'

export type EditorBreakpoint = 'desktop' | 'tablet' | 'mobile'

export interface EditorState {
  selectedNodeId: string | null
  dirty: boolean
  breakpoint: EditorBreakpoint
  canUndo: boolean
  canRedo: boolean
}

export function createEditorStore<T extends NonNullable<unknown>>() {
  const selectionStore = createSelectionStore()
  const historyStore = createHistoryStore<T>()
  let dirty = false
  let breakpoint: EditorBreakpoint = 'desktop'

  function getState(): EditorState {
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

  return {
    selectNode(nodeId: string) {
      selectionStore.selectNode(nodeId)
    },
    clearSelection() {
      selectionStore.clearSelection()
    },
    markDirty() {
      dirty = true
    },
    markClean() {
      dirty = false
    },
    setBreakpoint(nextBreakpoint: EditorBreakpoint) {
      breakpoint = nextBreakpoint
    },
    pushHistory(snapshot: T) {
      return historyStore.push(snapshot)
    },
    undoHistory() {
      return historyStore.undo()
    },
    redoHistory() {
      return historyStore.redo()
    },
    getState,
  }
}
