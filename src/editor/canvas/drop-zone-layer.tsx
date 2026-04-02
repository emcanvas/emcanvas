import type { CanvasDocument } from '../../foundation/types/canvas'
import { canDropPayload, parseDndPayload } from '../dnd/dnd-guards'
import { createNode, moveNode } from '../dnd/dnd-operations'
import { EMCANVAS_DND_MIME_TYPE } from '../dnd/dnd-types'

export interface DropZoneLayerProps {
  document: CanvasDocument
  targetParentId: string
  label: string
  onDocumentChange: (document: CanvasDocument) => void
}

export function DropZoneLayer({
  document,
  targetParentId,
  label,
  onDocumentChange,
}: DropZoneLayerProps) {
  return (
    <div
      aria-label={label}
      onDragOver={(event) => {
        const payload = parseDndPayload(event.dataTransfer.getData(EMCANVAS_DND_MIME_TYPE))

        if (!payload || !canDropPayload(document, payload, targetParentId)) {
          return
        }

        event.preventDefault()
      }}
      onDrop={(event) => {
        const payload = parseDndPayload(event.dataTransfer.getData(EMCANVAS_DND_MIME_TYPE))

        if (!payload || !canDropPayload(document, payload, targetParentId)) {
          return
        }

        event.preventDefault()

        onDocumentChange(
          payload.kind === 'create'
            ? createNode(document, targetParentId, payload.nodeType)
            : moveNode(document, payload.nodeId, targetParentId),
        )
      }}
    />
  )
}
