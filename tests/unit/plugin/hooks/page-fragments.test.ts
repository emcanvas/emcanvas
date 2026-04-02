import { describe, expect, it } from 'vitest'

import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../../../src/foundation/shared/constants'
import { pageFragments } from '../../../../src/plugin/hooks/page-fragments'

describe('pageFragments', () => {
  it('returns publish-time head fragments only for emcanvas entries', () => {
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
    ).toEqual([
      {
        slot: 'head',
        html: expect.stringContaining('data-emcanvas-page-fragments'),
      },
    ])

    expect(pageFragments({ entry: { data: {} } })).toEqual([])
  })
})
