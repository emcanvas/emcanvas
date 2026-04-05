import type { CanvasNode } from '../../foundation/types/canvas'
import { buildStyleDeclarations } from './build-style-declarations'
import { buildMediaRules } from './build-media-rules'
import { collectNodeRules } from './collect-media-rules'
import { sanitizeCssSelectorValue } from './sanitize-css-selector-value'

const ROOT_BASE_RULE = '[data-emcanvas-root]{width:100%;}'

function buildDesktopRule(node: CanvasNode): string[] {
  const declarations = buildStyleDeclarations(node.styles.desktop)

  if (!declarations) {
    return []
  }

  return [
    `[data-emcanvas-node="${sanitizeCssSelectorValue(node.id)}"]{${declarations};}`,
  ]
}

export function buildRendererStylesheet(root: CanvasNode): string {
  const desktopRules = collectNodeRules(root, buildDesktopRule)
  const mediaRules = collectNodeRules(root, (node) =>
    buildMediaRules(node.id, node.styles),
  )
  const rules = [...desktopRules, ...mediaRules]

  if (rules.length === 0) {
    return ''
  }

  return `${ROOT_BASE_RULE}${rules.join('')}`
}
