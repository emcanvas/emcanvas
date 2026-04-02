export const EMCANVAS_DND_MIME_TYPE = 'application/emcanvas-dnd'

export interface CreateNodeDragPayload {
  kind: 'create'
  nodeType: string
}

export interface MoveNodeDragPayload {
  kind: 'move'
  nodeId: string
}

export type DndPayload = CreateNodeDragPayload | MoveNodeDragPayload
