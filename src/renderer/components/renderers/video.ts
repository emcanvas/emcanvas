import type { CanvasNodeRenderer } from '../registry'

export const renderVideoNode: CanvasNodeRenderer = (node) => ({
  kind: 'video',
  src: typeof node.props.src === 'string' ? node.props.src : '',
})
