import type { CanvasNode } from '../../foundation/types/canvas'
import { buildMediaRules } from './build-media-rules'

export function collectMediaRules(root: CanvasNode): string {
  return [
    ...buildMediaRules(root.id, root.styles),
    ...(root.children ?? []).flatMap((child) => collectMediaRules(child)),
  ].join('')
}
