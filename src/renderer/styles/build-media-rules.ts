import type { ResponsiveStyles } from '../../foundation/types/canvas'
import { buildStyleDeclarations } from './build-style-declarations'
import { sanitizeCssSelectorValue } from './sanitize-css-selector-value'

const MEDIA_QUERIES = {
  tablet: '(max-width: 1024px)',
  mobile: '(max-width: 767px)',
} as const

export function buildMediaRules(
  nodeId: string,
  styles: ResponsiveStyles,
): string[] {
  return Object.entries(MEDIA_QUERIES).flatMap(([breakpoint, mediaQuery]) => {
    const declarations = buildStyleDeclarations(
      styles[breakpoint as keyof typeof MEDIA_QUERIES] ?? {},
    )

    if (!declarations) {
      return []
    }

    return [
      `@media ${mediaQuery}{[data-emcanvas-node="${sanitizeCssSelectorValue(nodeId)}"]{${declarations};}}`,
    ]
  })
}
