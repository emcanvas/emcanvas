import { CreateNodeCommand } from '../commands/create-node-command'
import type { Command } from '../commands/command'
import { MoveNodeCommand } from '../commands/move-node-command'
import type { CanvasDocument } from '../../foundation/types/canvas'
import { canDropPayload, parseDndPayload } from '../dnd/dnd-guards'
import { createNodeFromWidgetType } from '../dnd/dnd-operations'
import { EMCANVAS_DND_MIME_TYPE } from '../dnd/dnd-types'

export interface DropZoneLayerProps {
  getDocument: () => CanvasDocument
  targetParentId: string
  label: string
  setDocument: (document: CanvasDocument) => void
  onCommand: (command: Command) => void
}

export function DropZoneLayer({
  getDocument,
  targetParentId,
  label,
  setDocument,
  onCommand,
}: DropZoneLayerProps) {
  return (
    <div
      aria-label={label}
      onDragOver={(event) => {
        const document = getDocument()
        const payload = parseDndPayload(event.dataTransfer.getData(EMCANVAS_DND_MIME_TYPE))

        if (!payload || !canDropPayload(document, payload, targetParentId)) {
          return
        }

        event.preventDefault()
      }}
      onDrop={(event) => {
        const document = getDocument()
        const payload = parseDndPayload(event.dataTransfer.getData(EMCANVAS_DND_MIME_TYPE))

        if (!payload || !canDropPayload(document, payload, targetParentId)) {
          return
        }

        event.preventDefault()

        onCommand(
          payload.kind === 'create'
            ? new CreateNodeCommand({
                getDocument,
                setDocument,
                parentId: targetParentId,
                node: createNodeFromWidgetType(payload.nodeType),
              })
            : new MoveNodeCommand({
                getDocument,
                setDocument,
                nodeId: payload.nodeId,
                targetParentId,
              }),
        )
      }}
    />
  )
}
