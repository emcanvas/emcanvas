import type { CanvasNodeRenderer } from '../../types/renderer'

export const renderTextNode: CanvasNodeRenderer = (node) => ({
  category: 'leaf',
  kind: 'text',
  tag: 'p',
  text: typeof node.props.text === 'string' ? node.props.text : '',
})
