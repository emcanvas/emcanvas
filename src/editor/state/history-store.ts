export interface HistoryState<T> {
  past: T[]
  present: T | null
  future: T[]
  canUndo: boolean
  canRedo: boolean
}

function createState<T>(past: T[], present: T | null, future: T[]): HistoryState<T> {
  return {
    past,
    present,
    future,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}

export function createHistoryStore<T>() {
  let state = createState<T>([], null, [])

  return {
    push(snapshot: T) {
      state = createState(
        state.present === null ? state.past : [...state.past, state.present],
        snapshot,
        [],
      )

      return state.present
    },
    undo() {
      if (state.past.length === 0) {
        return null
      }

      const previous = state.past[state.past.length - 1] ?? null
      const nextFuture = state.present === null ? state.future : [state.present, ...state.future]

      state = createState(state.past.slice(0, -1), previous, nextFuture)

      return state.present
    },
    redo() {
      if (state.future.length === 0) {
        return null
      }

      const [next, ...future] = state.future

      state = createState(
        state.present === null ? state.past : [...state.past, state.present],
        next ?? null,
        future,
      )

      return state.present
    },
    getState() {
      return state
    },
  }
}
