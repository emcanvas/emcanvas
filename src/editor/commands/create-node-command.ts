import type { CanvasDocument, CanvasNode } from '../../foundation/types/canvas'
import { widgetRegistry } from '../registry/widget-registry'
import type { Command } from './command'
import { insertChildNode } from '../model/document-mutations'

export interface CreateNodeCommandOptions {
  getDocument: () => CanvasDocument
  setDocument: (document: CanvasDocument) => void
  parentId: string
  node: CanvasNode
}

export class CreateNodeCommand implements Command {
  private previousDocument: CanvasDocument | null = null

  constructor(private readonly options: CreateNodeCommandOptions) {}

  execute(): void {
    const currentDocument = this.options.getDocument()
    this.previousDocument = currentDocument
    this.options.setDocument(
      insertChildNode(currentDocument, this.options.parentId, this.options.node, widgetRegistry),
    )
  }

  undo(): void {
    if (!this.previousDocument) {
      return
    }

    this.options.setDocument(this.previousDocument)
  }
}
