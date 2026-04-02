import type { CanvasDocument } from '../../foundation/types/canvas'
import type { EditorStore } from './editor-store'

export interface AutosaveController {
  dispose(): void
}

export function createAutosaveController({
  delayMs,
  store,
  getDocument,
  save,
}: {
  delayMs: number
  store: EditorStore<CanvasDocument>
  getDocument: () => CanvasDocument
  save: (document: CanvasDocument) => Promise<void>
}): AutosaveController {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let dirtyVersion = 0

  const unsubscribe = store.subscribe(() => {
    const { dirty } = store.getState()

    if (!dirty) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      return
    }

    dirtyVersion += 1

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    const saveVersion = dirtyVersion

    timeoutId = setTimeout(() => {
      timeoutId = null

      void save(getDocument()).then(
        () => {
          if (dirtyVersion === saveVersion) {
            store.markClean()
          }
        },
        () => {
          // Keep the current document dirty so a later autosave can retry.
        },
      )
    }, delayMs)
  })

  return {
    dispose() {
      unsubscribe()

      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    },
  }
}
