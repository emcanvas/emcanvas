import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const dividerWidget: WidgetDefinition = {
  type: 'divider',
  label: 'Divider',
  category: WIDGET_CATEGORIES.content,
  defaultProps: {},
  propSchema: [],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
