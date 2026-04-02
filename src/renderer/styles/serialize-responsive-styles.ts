import type { ResponsiveStyles } from '../../foundation/types/canvas'
import type { SerializedResponsiveStyles } from '../types/renderer'
import { buildInlineStyle } from './build-inline-style'
import { buildMediaRules } from './build-media-rules'

export function serializeResponsiveStyles(
  nodeId: string,
  styles: ResponsiveStyles,
): SerializedResponsiveStyles {
  return {
    inlineStyle: buildInlineStyle(styles.desktop),
    mediaRules: buildMediaRules(nodeId, styles),
  }
}
