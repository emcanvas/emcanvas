import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const columnsWidget: WidgetDefinition = {
  type: 'columns',
  label: 'Columns',
  category: WIDGET_CATEGORIES.layout,
  defaultProps: {
    columns: 2,
  },
  propSchema: [
    {
      key: 'columns',
      type: 'number',
      min: 2,
      max: 4,
    },
  ],
  allowedChildren: ['container'],
  disableBaseWrapper: false,
}
