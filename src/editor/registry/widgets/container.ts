import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const containerWidget: WidgetDefinition = {
  type: 'container',
  label: 'Container',
  category: WIDGET_CATEGORIES.layout,
  defaultProps: {},
  propSchema: [],
  allowedChildren: 'any',
  disableBaseWrapper: false,
}
