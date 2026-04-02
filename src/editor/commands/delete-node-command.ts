import type { CanvasDocument } from '../../foundation/types/canvas'
import { deleteNode } from '../dnd/dnd-operations'
import type { Command } from './command'

export interface DeleteNodeCommandOptions {
  getDocument: () => CanvasDocument
  setDocument: (document: CanvasDocument) => void
  nodeId: string
}

export class DeleteNodeCommand implements Command {
  private previousDocument: CanvasDocument | null = null

  constructor(private readonly options: DeleteNodeCommandOptions) {}

  execute(): void {
    const currentDocument = this.options.getDocument()
    this.previousDocument = currentDocument
    this.options.setDocument(deleteNode(currentDocument, this.options.nodeId))
  }

  undo(): void {
    if (!this.previousDocument) {
      return
    }

    this.options.setDocument(this.previousDocument)
  }
}
