import type { NormalizedCanvasNode } from '../../types/renderer'
import type { CanvasNodeRenderer } from '../../types/renderer'

function getHeadingLevel(value: unknown): 1 | 2 | 3 | 4 | 5 | 6 {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6
    ? value
    : 2
}

function getText(props: NormalizedCanvasNode['props']): string {
  return typeof props.text === 'string' ? props.text : ''
}

export const renderHeadingNode: CanvasNodeRenderer = (node) => ({
  category: 'leaf',
  kind: 'heading',
  tag: `h${getHeadingLevel(node.props.level)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  level: getHeadingLevel(node.props.level),
  text: getText(node.props),
})
