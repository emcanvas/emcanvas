import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const videoWidget: WidgetDefinition = {
  type: 'video',
  label: 'Video',
  category: WIDGET_CATEGORIES.media,
  defaultProps: {
    src: '',
    provider: 'upload',
  },
  propSchema: [
    {
      key: 'src',
      type: 'string',
    },
    {
      key: 'provider',
      type: 'string',
    },
  ],
  allowedChildren: 'none',
}
