import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const heroWidget: WidgetDefinition = {
  type: 'hero',
  label: 'Hero',
  category: WIDGET_CATEGORIES.content,
  defaultProps: {
    title: 'Build your next landing page',
    body: 'Launch a clear headline, short supporting copy, and one primary call to action.',
    ctaLabel: 'Get started',
    ctaHref: '#',
    imageSrc: '',
    imageAlt: '',
  },
  propSchema: [
    {
      key: 'title',
      type: 'string',
    },
    {
      key: 'body',
      type: 'string',
    },
    {
      key: 'ctaLabel',
      type: 'string',
      label: 'CTA label',
    },
    {
      key: 'ctaHref',
      type: 'string',
      label: 'CTA href',
    },
    {
      key: 'imageSrc',
      type: 'media',
      label: 'Image src',
    },
    {
      key: 'imageAlt',
      type: 'string',
      label: 'Image alt',
    },
  ],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
