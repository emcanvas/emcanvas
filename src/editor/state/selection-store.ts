export interface SelectionState {
  selectedNodeId: string | null
}

export function createSelectionStore() {
  let state: SelectionState = {
    selectedNodeId: null,
  }

  return {
    selectNode(nodeId: string) {
      state = {
        selectedNodeId: nodeId,
      }
    },
    clearSelection() {
      state = {
        selectedNodeId: null,
      }
    },
    getState() {
      return state
    },
  }
}
