import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const sectionWidget: WidgetDefinition = {
  type: 'section',
  label: 'Section',
  category: WIDGET_CATEGORIES.layout,
  defaultProps: {},
  propSchema: [],
  allowedChildren: 'any',
  disableBaseWrapper: false,
}
