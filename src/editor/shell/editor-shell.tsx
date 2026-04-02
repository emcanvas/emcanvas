import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import type { CanvasDocument } from '../../foundation/types/canvas'
import { CanvasViewport } from '../canvas/canvas-viewport'
import { createEditorStore } from '../state/editor-store'
import { EditorSidebar } from './editor-sidebar'
import { EditorStatusbar } from './editor-statusbar'
import { EditorToolbar } from './editor-toolbar'

const document = createDefaultCanvasDocument()
const editorStore = createEditorStore<CanvasDocument>()

export function EditorShell() {
  const state = editorStore.getState()

  return (
    <div>
      <EditorToolbar canUndo={state.canUndo} canRedo={state.canRedo} />
      <div>
        <CanvasViewport document={document} />
        <EditorSidebar />
      </div>
      <EditorStatusbar breakpoint={state.breakpoint} dirty={state.dirty} />
    </div>
  )
}
