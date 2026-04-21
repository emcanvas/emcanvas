import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const buttonWidget: WidgetDefinition = {
  type: 'button',
  label: 'Button',
  category: WIDGET_CATEGORIES.content,
  defaultProps: {
    label: 'Click me',
    href: '#',
  },
  propSchema: [
    {
      key: 'label',
      type: 'string',
    },
    {
      key: 'href',
      type: 'string',
    },
  ],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
