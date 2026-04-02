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

  const unsubscribe = store.subscribe(() => {
    if (!store.getState().dirty) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      return
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(async () => {
      timeoutId = null
      await save(getDocument())
      store.markClean()
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
