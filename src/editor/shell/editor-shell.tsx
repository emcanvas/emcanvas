import { useEffect, useState, useSyncExternalStore } from 'react'

import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import type { CanvasDocument } from '../../foundation/types/canvas'
import { CanvasViewport } from '../canvas/canvas-viewport'
import { createEditorStore, type EditorStore } from '../state/editor-store'
import { EditorSidebar } from './editor-sidebar'
import { EditorStatusbar } from './editor-statusbar'
import { EditorToolbar } from './editor-toolbar'

export interface EditorShellInstance {
  document: CanvasDocument
  store: EditorStore<CanvasDocument>
}

export interface EditorShellProps {
  initialDocument?: CanvasDocument
  onDocumentChange?: (document: CanvasDocument) => void
  onEditorReady?: (instance: EditorShellInstance) => void
}

export function EditorShell({
  initialDocument,
  onDocumentChange,
  onEditorReady,
}: EditorShellProps) {
  const [document, setDocument] = useState(() => initialDocument ?? createDefaultCanvasDocument())
  const [editorStore] = useState(() => createEditorStore<CanvasDocument>())
  const state = useSyncExternalStore(editorStore.subscribe, editorStore.getState)

  useEffect(() => {
    editorStore.pushHistory(document)
  }, [editorStore])

  useEffect(() => {
    if (initialDocument) {
      setDocument(initialDocument)
      editorStore.resetHistory(initialDocument)
    }
  }, [editorStore, initialDocument])

  function applyDocument(nextDocument: CanvasDocument, options?: { pushHistory?: boolean; markDirty?: boolean }) {
    setDocument(nextDocument)
    onDocumentChange?.(nextDocument)

    if (options?.markDirty ?? true) {
      editorStore.markDirty()
    }

    if (options?.pushHistory ?? true) {
      editorStore.pushHistory(nextDocument)
    }
  }

  function handleDocumentChange(nextDocument: CanvasDocument) {
    applyDocument(nextDocument)
  }

  function handleUndo() {
    const nextDocument = editorStore.undoHistory()

    if (!nextDocument) {
      return
    }

    applyDocument(nextDocument, { pushHistory: false })
  }

  function handleRedo() {
    const nextDocument = editorStore.redoHistory()

    if (!nextDocument) {
      return
    }

    applyDocument(nextDocument, { pushHistory: false })
  }

  useEffect(() => {
    onEditorReady?.({ document, store: editorStore })
  }, [document, editorStore, onEditorReady])

  return (
    <div>
      <EditorToolbar canUndo={state.canUndo} canRedo={state.canRedo} onUndo={handleUndo} onRedo={handleRedo} />
      <div>
        <CanvasViewport document={document} />
        <EditorSidebar
          document={document}
          getDocument={() => document}
          state={state}
          onBreakpointChange={(breakpoint) => editorStore.setBreakpoint(breakpoint)}
          onDocumentChange={handleDocumentChange}
          onCommand={(command) => command.execute()}
        />
      </div>
      <EditorStatusbar breakpoint={state.breakpoint} dirty={state.dirty} />
    </div>
  )
}
