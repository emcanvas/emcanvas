import type { CanvasDocument } from '../../foundation/types/canvas'
import { updateNodeProps } from '../commands/update-props-command'
import { updateNodeStyles } from '../commands/update-styles-command'
import { getNodeAtPath, findNodePathById } from '../shared/tree-path'
import type { EditorState } from '../state/editor-store'
import { PropertyInspector } from '../inspector/property-inspector'

export interface EditorSidebarProps {
  document: CanvasDocument
  state: EditorState
  onBreakpointChange: (breakpoint: EditorState['breakpoint']) => void
  onDocumentChange: (document: CanvasDocument) => void
}

export function EditorSidebar({ document, state, onBreakpointChange, onDocumentChange }: EditorSidebarProps) {
  const path = state.selectedNodeId === null ? null : findNodePathById(document.root, state.selectedNodeId)
  const node = path === null ? null : getNodeAtPath(document.root, path)

  return (
    <aside aria-label="Property inspector">
      <PropertyInspector
        node={node}
        breakpoint={state.breakpoint}
        onBreakpointChange={onBreakpointChange}
        onUpdateProps={(nextProps) => {
          if (!node) {
            return
          }

          onDocumentChange(updateNodeProps(document, node.id, nextProps))
        }}
        onUpdateStyles={(nextStyles) => {
          if (!node) {
            return
          }

          onDocumentChange(updateNodeStyles(document, node.id, state.breakpoint, nextStyles))
        }}
      />
    </aside>
  )
}
