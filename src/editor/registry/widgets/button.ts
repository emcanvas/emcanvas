import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const buttonWidget: WidgetDefinition = {
  type: 'button',
  label: 'Button',
  category: WIDGET_CATEGORIES.content,
  defaultProps: {
    text: 'Click me',
    href: '#',
  },
  propSchema: [
    {
      key: 'text',
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
