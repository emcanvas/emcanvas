import type { CanvasNode } from '../../foundation/types/canvas'

export interface CanvasNodeRendererProps {
  node: CanvasNode
}

export function CanvasNodeRenderer({ node }: CanvasNodeRendererProps) {
  return (
    <article data-node-id={node.id} data-node-type={node.type}>
      <strong>{node.type}</strong>
      {node.children?.length ? (
        <div>
          {node.children.map((child) => (
            <CanvasNodeRenderer key={child.id} node={child} />
          ))}
        </div>
      ) : null}
    </article>
  )
}
