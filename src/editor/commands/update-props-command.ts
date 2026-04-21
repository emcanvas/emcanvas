import { createNodeId } from '../../foundation/shared/ids'
import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasNode } from '../../foundation/types/canvas'
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
      ...updateNodeWithProps(node, nextProps),
    })),
  }
}

function updateNodeWithProps(
  node: CanvasNode,
  nextProps: Record<string, unknown>,
): CanvasNode {
  const mergedProps = {
    ...node.props,
    ...nextProps,
  }

  if (node.type !== 'columns') {
    return {
      ...node,
      props: mergedProps,
    }
  }

  return syncColumnsNode(node, mergedProps)
}

function syncColumnsNode(
  node: CanvasNode,
  nextProps: Record<string, unknown>,
): CanvasNode {
  const existingChildren = [...(node.children ?? [])]
  const requestedColumns = normalizeColumnsCount(
    nextProps.columns,
    Math.max(
      existingChildren.length,
      normalizeColumnsCount(node.props.columns, 2),
    ),
  )

  if (existingChildren.length < requestedColumns) {
    existingChildren.push(
      ...Array.from(
        { length: requestedColumns - existingChildren.length },
        () => createEmptyContainerNode(),
      ),
    )
  }

  const removableChildren = existingChildren.slice(requestedColumns)
  const nextColumns =
    removableChildren.length > 0 && removableChildren.some(hasNestedContent)
      ? existingChildren.length
      : requestedColumns

  return {
    ...node,
    props: {
      ...nextProps,
      columns: nextColumns,
    },
    children: existingChildren.slice(0, nextColumns),
  }
}

function normalizeColumnsCount(value: unknown, fallback: number): number {
  return typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 2 &&
    value <= 4
    ? value
    : fallback
}

function createEmptyContainerNode(): CanvasNode {
  return {
    id: createNodeId('container'),
    type: 'container',
    props: {},
    styles: { desktop: {} },
    children: [],
  }
}

function hasNestedContent(node: CanvasNode): boolean {
  return (node.children?.length ?? 0) > 0
}

export class UpdateNodePropsCommand implements Command {
  private previousDocument: CanvasDocument | null = null

  constructor(private readonly options: UpdateNodePropsCommandOptions) {}

  execute(): void {
    const currentDocument = this.options.getDocument()
    this.previousDocument = currentDocument
    this.options.setDocument(
      updateNodeProps(
        currentDocument,
        this.options.nodeId,
        this.options.nextProps,
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
