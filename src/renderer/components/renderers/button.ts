import type { CanvasNodeRenderer } from '../../types/renderer'
import { normalizeButtonHref } from '../../../foundation/shared/button-href'

export const renderButtonNode: CanvasNodeRenderer = (node) => ({
  category: 'leaf',
  kind: 'button',
  tag: 'a',
  attributes: {
    href: normalizeButtonHref(node.props.href),
  },
  textContent:
    typeof node.props.label === 'string'
      ? node.props.label
      : typeof node.props.text === 'string'
        ? node.props.text
        : '',
})
