import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const imageWidget: WidgetDefinition = {
  type: 'image',
  label: 'Image',
  category: WIDGET_CATEGORIES.media,
  defaultProps: {
    src: '',
    alt: '',
  },
  propSchema: [
    {
      key: 'src',
      type: 'media',
    },
    {
      key: 'alt',
      type: 'string',
    },
  ],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
