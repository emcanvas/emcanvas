import type { CanvasDocument } from '../../foundation/types/canvas'
import { DeleteNodeCommand } from '../commands/delete-node-command'
import { UpdateNodePropsCommand } from '../commands/update-props-command'
import { UpdateNodeStylesCommand } from '../commands/update-styles-command'
import type { Command } from '../commands/command'
import { canWidgetAcceptChildType } from '../model/document-validation'
import { widgetRegistry } from '../registry/widget-registry'
import { getNodeAtPath, findNodePathById } from '../shared/tree-path'
import type { EditorState } from '../state/editor-store'
import { PropertyInspector } from '../inspector/property-inspector'

export interface EditorSidebarProps {
  document: CanvasDocument
  getDocument?: () => CanvasDocument
  state: EditorState
  onBreakpointChange: (breakpoint: EditorState['breakpoint']) => void
  onAddNode?: (
    nodeType:
      | 'heading'
      | 'text'
      | 'button'
      | 'image'
      | 'hero'
      | 'features/cards'
      | 'container'
      | 'columns',
  ) => void
  onDeleteNode?: (nodeId: string) => void
  onDocumentChange: (document: CanvasDocument) => void
  onCommand?: (command: Command) => void
}

export function EditorSidebar({
  document,
  getDocument = () => document,
  state,
  onBreakpointChange,
  onAddNode,
  onDeleteNode,
  onDocumentChange,
  onCommand,
}: EditorSidebarProps) {
  const path =
    state.selectedNodeId === null
      ? null
      : findNodePathById(document.root, state.selectedNodeId)
  const node = path === null ? null : getNodeAtPath(document.root, path)
  const canInsertBasicBlocksInside =
    node !== null &&
    (canWidgetAcceptChildType(node.type, 'heading', widgetRegistry) ||
      canWidgetAcceptChildType(node.type, 'text', widgetRegistry) ||
      canWidgetAcceptChildType(node.type, 'button', widgetRegistry) ||
      canWidgetAcceptChildType(node.type, 'image', widgetRegistry) ||
      canWidgetAcceptChildType(node.type, 'hero', widgetRegistry) ||
      canWidgetAcceptChildType(node.type, 'features/cards', widgetRegistry))
  const canInsertContainerInside =
    node !== null &&
    canWidgetAcceptChildType(node.type, 'container', widgetRegistry)
  const canInsertColumnsInside =
    node !== null &&
    canWidgetAcceptChildType(node.type, 'columns', widgetRegistry)

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
        hasDocumentContent={(document.root.children?.length ?? 0) > 0}
        breakpoint={state.breakpoint}
        basicAddActionPlacement={
          canInsertBasicBlocksInside ? 'inside' : 'below'
        }
        containerAddActionPlacement="inside"
        columnsAddActionPlacement={canInsertColumnsInside ? 'inside' : 'below'}
        showAddContainerAction={canInsertContainerInside}
        canDeleteNode={(path?.length ?? 0) > 0}
        onBreakpointChange={onBreakpointChange}
        onAddContainer={() => onAddNode?.('container')}
        onAddColumns={() => onAddNode?.('columns')}
        onAddHeading={() => onAddNode?.('heading')}
        onAddText={() => onAddNode?.('text')}
        onAddButton={() => onAddNode?.('button')}
        onAddImage={() => onAddNode?.('image')}
        onAddHero={() => onAddNode?.('hero')}
        onAddFeaturesCards={() => onAddNode?.('features/cards')}
        onDeleteNode={() => {
          if (!node) {
            return
          }

          if (onDeleteNode) {
            onDeleteNode(node.id)
            return
          }

          dispatchCommand(
            new DeleteNodeCommand({
              getDocument,
              setDocument: onDocumentChange,
              nodeId: node.id,
            }),
          )
        }}
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
