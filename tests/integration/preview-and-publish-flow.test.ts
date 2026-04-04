// @vitest-environment node

import { describe, expect, it } from 'vitest'

import '../../src/admin/lib/plugin-api'
import { CANVAS_DOCUMENT_VERSION } from '../../src/foundation/shared/constants'
import { renderEntryPage } from '../../src/integration/page/render-entry-page'
import { getPreviewLink } from '../../src/plugin/routes/preview-link'
import { saveDocument } from '../../src/editor/persistence/save-document'

describe('preview and publish flow', () => {
  it('creates a preview URL and renders the published emcanvas markup', async () => {
    const entry = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }
    const document = {
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
    }

    await saveDocument({ entry, canvasLayout: document })

    expect(
      getPreviewLink({
        entry,
        origin: 'https://example.test',
      }),
    ).toBe('https://example.test/preview?slug=home&source=emcanvas')

    await expect(renderEntryPage(entry.data)).resolves.toContain('data-emcanvas-root')
    await expect(renderEntryPage(entry.data)).resolves.toContain(
      'data-emcanvas-page-fragments',
    )
    await expect(renderEntryPage(entry.data)).resolves.toContain('Published heading')
  })

  it('skips emcanvas rendering when takeover is disabled', async () => {
    await expect(renderEntryPage({ slug: 'home' })).resolves.toBeNull()
  })
})
