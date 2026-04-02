import type { Command } from '../commands/command'

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

function cloneState<T>(state: HistoryState<T>): HistoryState<T> {
  return {
    past: [...state.past],
    present: state.present,
    future: [...state.future],
    canUndo: state.canUndo,
    canRedo: state.canRedo,
  }
}

export function createHistoryStore<T extends NonNullable<unknown>>() {
  let state = createState<T>([], null, [])
  let pastCommands: Command[] = []
  let futureCommands: Command[] = []

  function canUndo() {
    return pastCommands.length > 0 || state.past.length > 0
  }

  function canRedo() {
    return futureCommands.length > 0 || state.future.length > 0
  }

  function createCombinedState(): HistoryState<T> {
    return {
      ...cloneState(state),
      canUndo: canUndo(),
      canRedo: canRedo(),
    }
  }

  return {
    execute(command: Command) {
      command.execute()
      pastCommands = [...pastCommands, command]
      futureCommands = []
    },
    push(snapshot: T) {
      state = createState(
        state.present === null ? state.past : [...state.past, state.present],
        snapshot,
        [],
      )

      return state.present
    },
    undo() {
      if (pastCommands.length > 0) {
        const command = pastCommands[pastCommands.length - 1]

        command?.undo()
        pastCommands = pastCommands.slice(0, -1)
        futureCommands = command ? [command, ...futureCommands] : futureCommands

        return null
      }

      if (state.past.length === 0) {
        return null
      }

      const previous = state.past[state.past.length - 1] ?? null
      const nextFuture = state.present === null ? state.future : [state.present, ...state.future]

      state = createState(state.past.slice(0, -1), previous, nextFuture)

      return state.present
    },
    redo() {
      if (futureCommands.length > 0) {
        const [command, ...nextFutureCommands] = futureCommands

        command?.execute()
        futureCommands = nextFutureCommands
        pastCommands = command ? [...pastCommands, command] : pastCommands

        return null
      }

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
    canUndo,
    canRedo,
    getState() {
      return createCombinedState()
    },
  }
}
