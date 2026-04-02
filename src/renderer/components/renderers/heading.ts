import type { NormalizedCanvasNode } from '../../types/renderer'
import type { CanvasNodeRenderer } from '../registry'

function getHeadingLevel(value: unknown): 1 | 2 | 3 | 4 | 5 | 6 {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6
    ? value
    : 2
}

function getText(props: NormalizedCanvasNode['props']): string {
  return typeof props.text === 'string' ? props.text : ''
}

export const renderHeadingNode: CanvasNodeRenderer = (node) => ({
  kind: 'heading',
  level: getHeadingLevel(node.props.level),
  text: getText(node.props),
})
