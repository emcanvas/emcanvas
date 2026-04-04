// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { pluginApi } from '../../src/admin/lib/plugin-api'
import { renderEntryPage } from '../../src/integration/page/render-entry-page'
import { getPreviewLink } from '../../src/plugin/routes/preview-link'
import { createFixtureDocument, createFixtureHeadingNode } from '../fixtures/document-factory'

describe('preview and publish flow', () => {
  it('creates a preview URL and renders the published emcanvas markup', async () => {
    const entry = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }
    const document = createFixtureDocument()

    document.root.children = [createFixtureHeadingNode('Published heading')]

    await pluginApi.saveDocument({ entry, canvasLayout: document })

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
