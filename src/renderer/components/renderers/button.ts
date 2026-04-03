import type { CanvasNodeRenderer } from '../../types/renderer'

export const renderButtonNode: CanvasNodeRenderer = (node) => ({
  category: 'leaf',
  kind: 'button',
  tag: 'a',
  href: typeof node.props.href === 'string' ? node.props.href : '#',
  label:
    typeof node.props.label === 'string'
      ? node.props.label
      : typeof node.props.text === 'string'
        ? node.props.text
        : '',
})
