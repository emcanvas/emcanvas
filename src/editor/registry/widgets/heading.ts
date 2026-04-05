import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const headingWidget: WidgetDefinition = {
  type: 'heading',
  label: 'Heading',
  category: WIDGET_CATEGORIES.content,
  defaultProps: {
    text: 'Heading',
    level: 2,
  },
  propSchema: [
    {
      key: 'text',
      type: 'string',
    },
    {
      key: 'level',
      type: 'number',
      min: 1,
      max: 6,
    },
  ],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
