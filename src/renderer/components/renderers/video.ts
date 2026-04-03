import type { CanvasNodeRenderer } from '../../types/renderer'

export const renderVideoNode: CanvasNodeRenderer = (node) => ({
  category: 'leaf',
  kind: 'video',
  tag: 'video',
  src: typeof node.props.src === 'string' ? node.props.src : '',
})
