import type { Command } from '../commands/command'

export interface HistoryState {
  canUndo: boolean
  canRedo: boolean
}

function createState(past: Command[], future: Command[]): HistoryState {
  return {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}

function cloneState(state: HistoryState): HistoryState {
  return {
    canUndo: state.canUndo,
    canRedo: state.canRedo,
  }
}

export function createHistoryStore() {
  let pastCommands: Command[] = []
  let futureCommands: Command[] = []

  return {
    execute(command: Command) {
      command.execute()
      pastCommands = [...pastCommands, command]
      futureCommands = []
    },
    undo() {
      if (pastCommands.length > 0) {
        const command = pastCommands[pastCommands.length - 1]

        command?.undo()
        pastCommands = pastCommands.slice(0, -1)
        futureCommands = command ? [command, ...futureCommands] : futureCommands
      }
    },
    redo() {
      if (futureCommands.length > 0) {
        const [command, ...nextFutureCommands] = futureCommands

        command?.execute()
        futureCommands = nextFutureCommands
        pastCommands = command ? [...pastCommands, command] : pastCommands
      }
    },
    canUndo() {
      return pastCommands.length > 0
    },
    canRedo() {
      return futureCommands.length > 0
    },
    getState() {
      return cloneState(createState(pastCommands, futureCommands))
    },
  }
}
