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
  onEditorReady?: (instance: EditorShellInstance) => void
}

export function EditorShell({ onEditorReady }: EditorShellProps) {
  const [document, setDocument] = useState(() => createDefaultCanvasDocument())
  const [editorStore] = useState(() => createEditorStore<CanvasDocument>())
  const state = useSyncExternalStore(editorStore.subscribe, editorStore.getState)

  function handleDocumentChange(nextDocument: CanvasDocument) {
    setDocument(nextDocument)
    editorStore.markDirty()
    editorStore.pushHistory(nextDocument)
  }

  useEffect(() => {
    onEditorReady?.({ document, store: editorStore })
  }, [document, editorStore, onEditorReady])

  return (
    <div>
      <EditorToolbar canUndo={state.canUndo} canRedo={state.canRedo} />
      <div>
        <CanvasViewport document={document} />
        <EditorSidebar
          document={document}
          state={state}
          onBreakpointChange={(breakpoint) => editorStore.setBreakpoint(breakpoint)}
          onDocumentChange={handleDocumentChange}
        />
      </div>
      <EditorStatusbar breakpoint={state.breakpoint} dirty={state.dirty} />
    </div>
  )
}
