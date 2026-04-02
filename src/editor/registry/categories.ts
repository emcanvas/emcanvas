export const WIDGET_CATEGORIES = {
  layout: 'layout',
  content: 'content',
  media: 'media',
} as const

export type WidgetCategory =
  (typeof WIDGET_CATEGORIES)[keyof typeof WIDGET_CATEGORIES]
