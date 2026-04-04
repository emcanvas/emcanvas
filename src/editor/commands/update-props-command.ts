import type { CanvasDocument } from '../../foundation/types/canvas'
import { findNodePathById, replaceNodeAtPath } from '../shared/tree-path'
import type { Command } from './command'

export interface UpdateNodePropsCommandOptions {
  getDocument: () => CanvasDocument
  setDocument: (document: CanvasDocument) => void
  nodeId: string
  nextProps: Record<string, unknown>
}

export function updateNodeProps(
  document: CanvasDocument,
  nodeId: string,
  nextProps: Record<string, unknown>,
): CanvasDocument {
  const path = findNodePathById(document.root, nodeId)

  if (!path) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  return {
    ...document,
    root: replaceNodeAtPath(document.root, path, (node) => ({
      ...node,
      props: {
        ...node.props,
        ...nextProps,
      },
    })),
  }
}

export class UpdateNodePropsCommand implements Command {
  private previousDocument: CanvasDocument | null = null

  constructor(private readonly options: UpdateNodePropsCommandOptions) {}

  execute(): void {
    const currentDocument = this.options.getDocument()
    this.previousDocument = currentDocument
    this.options.setDocument(updateNodeProps(currentDocument, this.options.nodeId, this.options.nextProps))
  }

  undo(): void {
    if (!this.previousDocument) {
      return
    }

    this.options.setDocument(this.previousDocument)
  }
}
