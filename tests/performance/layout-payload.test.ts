import { describe, expect, it } from 'vitest'

import { buildEntryPayload } from '../../src/editor/persistence/entry-payload'
import { CANVAS_DOCUMENT_VERSION } from '../../src/foundation/shared/constants'
import {
  MVP_LAYOUT_PAYLOAD_BUDGET_BYTES,
  isPayloadWithinBudget,
  measurePayloadBytes,
} from '../../src/shared/perf/payload-budget'

describe('layout payload budget', () => {
  it('keeps the published payload under the agreed MVP threshold', () => {
    const payload = buildEntryPayload(
      { slug: 'home' },
      {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: [
            {
              id: 'heading-1',
              type: 'heading',
              props: {
                text: 'Published heading',
                level: 2,
              },
              styles: { desktop: {} },
              children: [],
            },
          ],
        },
        settings: {},
      },
    )

    expect(measurePayloadBytes(payload)).toBeLessThanOrEqual(MVP_LAYOUT_PAYLOAD_BUDGET_BYTES)
    expect(isPayloadWithinBudget(payload)).toBe(true)
  })

  it('flags payloads that exceed the agreed MVP threshold', () => {
    const oversizedPayload = {
      canvasLayout: {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: [
            {
              id: 'text-1',
              type: 'text',
              props: {
                content: 'x'.repeat(MVP_LAYOUT_PAYLOAD_BUDGET_BYTES),
              },
              styles: { desktop: {} },
              children: [],
            },
          ],
        },
        settings: {},
      },
    }

    expect(isPayloadWithinBudget(oversizedPayload)).toBe(false)
  })
})
