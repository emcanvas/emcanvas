import type { CanvasNodeRenderer } from '../registry'

export const renderTextNode: CanvasNodeRenderer = (node) => ({
  kind: 'text',
  text: typeof node.props.text === 'string' ? node.props.text : '',
})
