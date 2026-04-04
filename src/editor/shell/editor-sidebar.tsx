import type { CanvasDocument } from '../../foundation/types/canvas'
import { UpdateNodePropsCommand } from '../commands/update-props-command'
import { UpdateNodeStylesCommand } from '../commands/update-styles-command'
import type { Command } from '../commands/command'
import { getNodeAtPath, findNodePathById } from '../shared/tree-path'
import type { EditorState } from '../state/editor-store'
import { PropertyInspector } from '../inspector/property-inspector'

export interface EditorSidebarProps {
  document: CanvasDocument
  getDocument?: () => CanvasDocument
  state: EditorState
  onBreakpointChange: (breakpoint: EditorState['breakpoint']) => void
  onDocumentChange: (document: CanvasDocument) => void
  onCommand?: (command: Command) => void
}

export function EditorSidebar({
  document,
  getDocument = () => document,
  state,
  onBreakpointChange,
  onDocumentChange,
  onCommand,
}: EditorSidebarProps) {
  const path = state.selectedNodeId === null ? null : findNodePathById(document.root, state.selectedNodeId)
  const node = path === null ? null : getNodeAtPath(document.root, path)

  function dispatchCommand(command: Command) {
    if (onCommand) {
      onCommand(command)
      return
    }

    command.execute()
  }

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

          dispatchCommand(
            new UpdateNodePropsCommand({
              getDocument,
              setDocument: onDocumentChange,
              nodeId: node.id,
              nextProps,
            }),
          )
        }}
        onUpdateStyles={(nextStyles) => {
          if (!node) {
            return
          }

          dispatchCommand(
            new UpdateNodeStylesCommand({
              getDocument,
              setDocument: onDocumentChange,
              nodeId: node.id,
              breakpoint: state.breakpoint,
              nextStyles,
            }),
          )
        }}
      />
    </aside>
  )
}
