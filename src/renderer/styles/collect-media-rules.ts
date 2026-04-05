import type { CanvasNode } from '../../foundation/types/canvas'

export function collectNodeRules(
  root: CanvasNode,
  buildRules: (node: CanvasNode) => string[],
): string[] {
  return [
    ...buildRules(root),
    ...(root.children ?? []).flatMap((child) =>
      collectNodeRules(child, buildRules),
    ),
  ]
}
