import type { CanvasNodeRenderer } from '../registry'

export const renderImageNode: CanvasNodeRenderer = (node) => ({
  kind: 'image',
  src: typeof node.props.src === 'string' ? node.props.src : '',
  alt: typeof node.props.alt === 'string' ? node.props.alt : '',
})
