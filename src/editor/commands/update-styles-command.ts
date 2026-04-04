import type { CanvasDocument } from '../../foundation/types/canvas'
import type { EditorBreakpoint } from '../state/editor-store'
import { findNodePathById, replaceNodeAtPath } from '../shared/tree-path'
import { updateResponsiveStyles } from '../styles/style-mutations'
import type { Command } from './command'

export interface UpdateNodeStylesCommandOptions {
  getDocument: () => CanvasDocument
  setDocument: (document: CanvasDocument) => void
  nodeId: string
  breakpoint: EditorBreakpoint
  nextStyles: Record<string, unknown>
}

export function updateNodeStyles(
  document: CanvasDocument,
  nodeId: string,
  breakpoint: EditorBreakpoint,
  nextStyles: Record<string, unknown>,
): CanvasDocument {
  const path = findNodePathById(document.root, nodeId)

  if (!path) {
    throw new Error(`Cannot find node '${nodeId}'`)
  }

  return {
    ...document,
    root: replaceNodeAtPath(document.root, path, (node) => ({
      ...node,
      styles: updateResponsiveStyles(node.styles, breakpoint, nextStyles),
    })),
  }
}

export class UpdateNodeStylesCommand implements Command {
  private previousDocument: CanvasDocument | null = null

  constructor(private readonly options: UpdateNodeStylesCommandOptions) {}

  execute(): void {
    const currentDocument = this.options.getDocument()
    this.previousDocument = currentDocument
    this.options.setDocument(
      updateNodeStyles(
        currentDocument,
        this.options.nodeId,
        this.options.breakpoint,
        this.options.nextStyles,
      ),
    )
  }

  undo(): void {
    if (!this.previousDocument) {
      return
    }

    this.options.setDocument(this.previousDocument)
  }
}
