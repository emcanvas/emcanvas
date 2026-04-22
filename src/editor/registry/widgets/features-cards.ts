import { WIDGET_CATEGORIES } from '../categories'
import type { WidgetDefinition } from '../widget-definition'

export const featuresCardsWidget: WidgetDefinition = {
  type: 'features/cards',
  label: 'Features / Cards',
  category: WIDGET_CATEGORIES.content,
  defaultProps: {
    title: 'Everything your team needs to ship faster',
    intro:
      'Pair a compact feature grid with your hero to explain the value proposition in seconds.',
    card1Title: 'Visual editing',
    card1Body:
      'Create landing sections directly on the canvas without switching contexts.',
    card2Title: 'Safe publishing',
    card2Body:
      'Keep layout JSON versioned inside entry.data for previews, drafts, and rollback.',
    card3Title: 'SSR output',
    card3Body:
      'Render a lightweight feature section on the frontend without custom host changes.',
  },
  propSchema: [
    {
      key: 'title',
      type: 'string',
    },
    {
      key: 'intro',
      type: 'string',
      label: 'Intro',
    },
    {
      key: 'card1Title',
      type: 'string',
      label: 'Card 1 title',
    },
    {
      key: 'card1Body',
      type: 'string',
      label: 'Card 1 body',
    },
    {
      key: 'card2Title',
      type: 'string',
      label: 'Card 2 title',
    },
    {
      key: 'card2Body',
      type: 'string',
      label: 'Card 2 body',
    },
    {
      key: 'card3Title',
      type: 'string',
      label: 'Card 3 title',
    },
    {
      key: 'card3Body',
      type: 'string',
      label: 'Card 3 body',
    },
  ],
  allowedChildren: 'none',
  disableBaseWrapper: false,
}
