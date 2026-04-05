import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const textWidget: WidgetDefinition = {
  type: 'text',
  label: 'Text',
  category: WIDGET_CATEGORIES.content,
  defaultProps: {
    text: 'Lorem ipsum',
  },
  propSchema: [
    {
      key: 'text',
      type: 'string',
    },
  ],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
