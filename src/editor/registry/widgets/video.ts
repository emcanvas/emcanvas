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
      type: 'media',
    },
    {
      key: 'provider',
      type: 'select',
      options: [
        {
          label: 'Upload',
          value: 'upload',
        },
        {
          label: 'YouTube',
          value: 'youtube',
        },
        {
          label: 'Vimeo',
          value: 'vimeo',
        },
      ],
    },
  ],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
