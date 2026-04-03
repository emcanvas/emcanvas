import type { CanvasNodeRenderer } from '../../types/renderer'

export const renderImageNode: CanvasNodeRenderer = (node) => ({
  category: 'leaf',
  kind: 'image',
  tag: 'img',
  src: typeof node.props.src === 'string' ? node.props.src : '',
  alt: typeof node.props.alt === 'string' ? node.props.alt : '',
})
