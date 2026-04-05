import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const spacerWidget: WidgetDefinition = {
  type: 'spacer',
  label: 'Spacer',
  category: WIDGET_CATEGORIES.layout,
  defaultProps: {
    size: 32,
  },
  propSchema: [
    {
      key: 'size',
      type: 'number',
      min: 0,
    },
  ],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
