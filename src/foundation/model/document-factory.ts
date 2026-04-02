import { CANVAS_DOCUMENT_VERSION } from '../shared/constants'
import { createNodeId } from '../shared/ids'
import type { CanvasDocument } from '../types/canvas'
import {
  createDefaultDocumentSettings,
  createDefaultNodeBase,
} from './defaults'

export function createDefaultCanvasDocument(): CanvasDocument {
  return {
    version: CANVAS_DOCUMENT_VERSION,
    root: {
      id: createNodeId(),
      ...createDefaultNodeBase(),
    },
    settings: createDefaultDocumentSettings(),
  }
}
