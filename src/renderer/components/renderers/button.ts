import type { CanvasNodeRenderer } from '../registry'

export const renderButtonNode: CanvasNodeRenderer = (node) => ({
  kind: 'button',
  href: typeof node.props.href === 'string' ? node.props.href : '#',
  label:
    typeof node.props.label === 'string'
      ? node.props.label
      : typeof node.props.text === 'string'
        ? node.props.text
        : '',
})
