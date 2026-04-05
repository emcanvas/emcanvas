import { describe, expect, it } from 'vitest'

import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../../../src/foundation/shared/constants'
import { pageFragments } from '../../../../src/plugin/hooks/page-fragments'

describe('pageFragments', () => {
  it('returns publish-time head fragments with scoped renderer CSS for styled emcanvas entries', () => {
    expect(
      pageFragments({
        entry: {
          data: {
            _emcanvas: {
              enabled: true,
              version: CANVAS_DOCUMENT_VERSION,
              editorVersion: EMCANVAS_EDITOR_VERSION,
            },
            canvasLayout: {
              version: CANVAS_DOCUMENT_VERSION,
              root: {
                id: 'root',
                type: 'section',
                props: {},
                styles: {
                  desktop: { padding: '24px' },
                  mobile: { padding: '12px' },
                },
                children: [
                  {
                    id: 'hero-title',
                    type: 'heading',
                    props: { text: 'Hello', level: 2 },
                    styles: { desktop: { color: '#111111' } },
                    children: [],
                  },
                ],
              },
              settings: {},
            },
          },
        },
      }),
    ).toEqual([
      {
        slot: 'head',
        html: '<style data-emcanvas-page-fragments>[data-emcanvas-root]{width:100%;}[data-emcanvas-node="root"]{padding:24px;}[data-emcanvas-node="hero-title"]{color:#111111;}@media (max-width: 767px){[data-emcanvas-node="root"]{padding:12px;}}</style>',
      },
    ])

    expect(pageFragments({ entry: { data: {} } })).toEqual([])
  })

  it('omits the stylesheet payload for valid styleless documents', () => {
    expect(
      pageFragments({
        entry: {
          data: {
            _emcanvas: {
              enabled: true,
              version: CANVAS_DOCUMENT_VERSION,
              editorVersion: EMCANVAS_EDITOR_VERSION,
            },
            canvasLayout: {
              version: CANVAS_DOCUMENT_VERSION,
              root: {
                id: 'root',
                type: 'section',
                props: {},
                styles: { desktop: {} },
                children: [],
              },
              settings: {},
            },
          },
        },
      }),
    ).toEqual([])
  })
})
