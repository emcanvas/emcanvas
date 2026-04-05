import type { CanvasNodeRenderer } from '../../types/renderer'

export const renderSpacerNode: CanvasNodeRenderer = () => ({
  category: 'leaf',
  kind: 'spacer',
  tag: 'div',
  attributes: {
    'aria-hidden': true,
  },
})
