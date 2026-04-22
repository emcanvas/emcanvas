import { CANVAS_DOCUMENT_VERSION } from '../../src/foundation/shared/constants'
import type {
  CanvasDocument,
  CanvasNode,
} from '../../src/foundation/types/canvas'

export function createFixtureDocument(): CanvasDocument {
  return {
    version: CANVAS_DOCUMENT_VERSION,
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    },
    settings: {},
  }
}

export function createFixtureHeadingNode(text = 'Welcome'): CanvasNode {
  return {
    id: 'heading-1',
    type: 'heading',
    props: {
      text,
      level: 2,
    },
    styles: { desktop: {} },
    children: [],
  }
}

export function createFixtureLandingPageDocument(): CanvasDocument {
  return {
    version: CANVAS_DOCUMENT_VERSION,
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [
        {
          id: 'hero-landing',
          type: 'hero',
          props: {
            title: 'Launch your next campaign faster',
            body: 'Build a simple landing page with one hero, one benefits section, and a clean publish flow.',
            ctaLabel: 'Start building',
            ctaHref: '/start-building',
            imageSrc: 'https://cdn.example.test/landing-hero.jpg',
            imageAlt: 'Landing page hero preview',
          },
          styles: { desktop: {} },
          children: [],
        },
        {
          id: 'features-cards-landing',
          type: 'features/cards',
          props: {
            title: 'Why teams can ship with the MVP',
            intro:
              'The minimal website-builder loop is enough to compose, publish, reload, and render a basic landing page.',
            card1Title: 'Hero section',
            card1Body: 'Lead with headline, body copy, CTA, and image.',
            card2Title: 'Benefits grid',
            card2Body:
              'Reinforce the value proposition with three compact cards.',
            card3Title: 'SSR output',
            card3Body:
              'Publish the same document structure that the frontend renders.',
          },
          styles: { desktop: {} },
          children: [],
        },
      ],
    },
    settings: {},
  }
}
