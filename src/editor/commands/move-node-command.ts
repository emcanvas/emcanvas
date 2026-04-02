import type { CanvasDocument } from '../../foundation/types/canvas'
import { moveNode } from '../dnd/dnd-operations'
import type { Command } from './command'

export interface MoveNodeCommandOptions {
  getDocument: () => CanvasDocument
  setDocument: (document: CanvasDocument) => void
  nodeId: string
  targetParentId: string
}

export class MoveNodeCommand implements Command {
  private previousDocument: CanvasDocument | null = null

  constructor(private readonly options: MoveNodeCommandOptions) {}

  execute(): void {
    const currentDocument = this.options.getDocument()
    this.previousDocument = currentDocument
    this.options.setDocument(
      moveNode(currentDocument, this.options.nodeId, this.options.targetParentId),
    )
  }

  undo(): void {
    if (!this.previousDocument) {
      return
    }

    this.options.setDocument(this.previousDocument)
  }
}
