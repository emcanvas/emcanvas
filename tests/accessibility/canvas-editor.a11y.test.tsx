import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CanvasEditorPage } from '../../src/admin/pages/CanvasEditorPage'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../src/foundation/types/canvas'

afterEach(() => {
  cleanup()
})

function createFixtureDocument(): CanvasDocument {
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

describe('CanvasEditorPage accessibility', () => {
  it('exposes named landmarks, status announcements, and publish controls', async () => {
    render(
      <CanvasEditorPage
        entry={{ data: { slug: 'home' } }}
        api={{
          loadDocument: vi.fn().mockResolvedValue({
            canvasLayout: createFixtureDocument(),
            _emcanvas: {
              enabled: false,
              version: CANVAS_DOCUMENT_VERSION,
              editorVersion: EMCANVAS_EDITOR_VERSION,
            },
          }),
          saveDocument: vi.fn().mockResolvedValue({}),
          getPreviewLink: vi.fn().mockReturnValue('/preview?slug=home&source=emcanvas'),
        }}
      />,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'EmCanvas editor' })).toBeInTheDocument()
    })

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'EmCanvas takeover status' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Publish status' })).toHaveTextContent(
      'Ready to publish',
    )
    expect(screen.getByRole('group', { name: 'Preview and publish actions' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open preview' })).toHaveAttribute(
      'href',
      '/preview?slug=home&source=emcanvas',
    )
    expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
  })
})
