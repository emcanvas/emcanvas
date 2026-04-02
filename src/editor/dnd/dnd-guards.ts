import type { CanvasDocument } from '../../foundation/types/canvas'
import type { DndPayload } from './dnd-types'
import { createNode, moveNode } from './dnd-operations'

export function parseDndPayload(value: string): DndPayload | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<DndPayload>

    if (parsed.kind === 'create' && typeof parsed.nodeType === 'string') {
      return { kind: 'create', nodeType: parsed.nodeType }
    }

    if (parsed.kind === 'move' && typeof parsed.nodeId === 'string') {
      return { kind: 'move', nodeId: parsed.nodeId }
    }
  } catch {
    return null
  }

  return null
}

export function canDropPayload(
  document: CanvasDocument,
  payload: DndPayload,
  targetParentId: string,
): boolean {
  try {
    if (payload.kind === 'create') {
      createNode(document, targetParentId, payload.nodeType)
    } else {
      moveNode(document, payload.nodeId, targetParentId)
    }

    return true
  } catch {
    return false
  }
}
