import '../../styles/editor.css'
import { useEffect, useState, useSyncExternalStore } from 'react'

import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import type { CanvasDocument, CanvasNode } from '../../foundation/types/canvas'
import { CanvasViewport } from '../canvas/canvas-viewport'
import { createNodeFromWidgetType } from '../dnd/dnd-operations'
import {
  insertChildNode,
  deleteNode,
  insertNodeBelow,
  resolveSelectionAfterDelete,
} from '../model/document-mutations'
import { canWidgetAcceptChildType } from '../model/document-validation'
import { widgetRegistry } from '../registry/widget-registry'
import { findNodePathById, getNodeAtPath } from '../shared/tree-path'
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
  const [editorState] = useState(() => {
    const document = initialDocument ?? createDefaultCanvasDocument()
    const store = createEditorStore<CanvasDocument>()

    store.resetHistory(document)

    return { document, store }
  })
  const [document, setDocument] = useState(editorState.document)
  const editorStore = editorState.store
  const state = useSyncExternalStore(
    editorStore.subscribe,
    editorStore.getState,
  )

  function syncSelection(
    nextDocument: CanvasDocument,
    nextSelectedNodeId?: string | null,
  ) {
    const selection = nextSelectedNodeId ?? state.selectedNodeId

    if (!selection) {
      editorStore.clearSelection()
      return
    }

    if (findNodePathById(nextDocument.root, selection)) {
      editorStore.selectNode(selection)
      return
    }

    editorStore.clearSelection()
  }

  useEffect(() => {
    if (initialDocument) {
      setDocument(initialDocument)
      editorStore.resetHistory(initialDocument)
    }
  }, [editorStore, initialDocument])

  function applyDocument(
    nextDocument: CanvasDocument,
    options?: {
      pushHistory?: boolean
      markDirty?: boolean
      selectedNodeId?: string | null
    },
  ) {
    setDocument(nextDocument)
    onDocumentChange?.(nextDocument)
    syncSelection(nextDocument, options?.selectedNodeId)

    if (options?.markDirty ?? true) {
      editorStore.markDirty()
    }

    if (options?.pushHistory ?? true) {
      editorStore.pushHistory(
        nextDocument,
        options?.selectedNodeId ?? state.selectedNodeId,
      )
    }
  }

  function handleDocumentChange(nextDocument: CanvasDocument) {
    applyDocument(nextDocument)
  }

  function handleCreateFirstBlock(
    nodeType: 'heading' | 'text' | 'button' | 'columns' = 'heading',
  ) {
    const nextNode = createNodeFromWidgetType(nodeType)
    const nextDocument = insertChildNode(
      document,
      document.root.id,
      nextNode,
      widgetRegistry,
    )

    applyDocument(nextDocument, {
      selectedNodeId: getInsertedNodeSelection(nextNode),
    })
  }

  function handleAddNode(
    nodeType: 'heading' | 'text' | 'button' | 'container' | 'columns',
  ) {
    const nextNode = createNodeFromWidgetType(nodeType)
    const anchorId = state.selectedNodeId ?? document.root.id
    const anchorPath = findNodePathById(document.root, anchorId)
    const anchorNode = anchorPath
      ? getNodeAtPath(document.root, anchorPath)
      : null
    const nextDocument =
      anchorNode &&
      canWidgetAcceptChildType(anchorNode.type, nextNode.type, widgetRegistry)
        ? insertChildNode(document, anchorNode.id, nextNode, widgetRegistry)
        : insertNodeBelow(document, anchorId, nextNode, widgetRegistry)

    applyDocument(nextDocument, {
      selectedNodeId: getInsertedNodeSelection(nextNode),
    })
  }

  function handleDeleteNode(nodeId: string) {
    const nextSelectedNodeId = resolveSelectionAfterDelete(document, nodeId)
    const nextDocument = deleteNode(document, nodeId)

    applyDocument(nextDocument, { selectedNodeId: nextSelectedNodeId })
  }

  function handleUndo() {
    const nextHistory = editorStore.undoHistory()

    if (!nextHistory) {
      return
    }

    applyDocument(nextHistory.snapshot, {
      markDirty: false,
      pushHistory: false,
      selectedNodeId: nextHistory.selectedNodeId,
    })
  }

  function handleRedo() {
    const nextHistory = editorStore.redoHistory()

    if (!nextHistory) {
      return
    }

    applyDocument(nextHistory.snapshot, {
      markDirty: false,
      pushHistory: false,
      selectedNodeId: nextHistory.selectedNodeId,
    })
  }

  useEffect(() => {
    onEditorReady?.({ document, store: editorStore })
  }, [document, editorStore, onEditorReady])

  return (
    <div className="emc-editor-shell">
      <EditorToolbar
        canUndo={state.canUndo}
        canRedo={state.canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <div className="emc-editor-shell__workspace">
        <CanvasViewport
          document={document}
          selectedNodeId={state.selectedNodeId}
          onSelectNode={(nodeId) => editorStore.selectNode(nodeId)}
          onCreateFirstBlock={handleCreateFirstBlock}
        />
        <EditorSidebar
          document={document}
          getDocument={() => document}
          state={state}
          onBreakpointChange={(breakpoint) =>
            editorStore.setBreakpoint(breakpoint)
          }
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
          onDocumentChange={handleDocumentChange}
          onCommand={(command) => command.execute()}
        />
      </div>
      <EditorStatusbar breakpoint={state.breakpoint} dirty={state.dirty} />
    </div>
  )
}
function getInsertedNodeSelection(node: CanvasNode): string {
  return node.type === 'columns' ? (node.children?.[0]?.id ?? node.id) : node.id
}
