import type { CanvasNodeRenderer } from '../../types/renderer'

export const renderDividerNode: CanvasNodeRenderer = () => ({
  category: 'leaf',
  kind: 'divider',
  tag: 'hr',
  isVoid: true,
})
