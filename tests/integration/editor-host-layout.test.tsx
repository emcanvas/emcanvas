import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CanvasEditorPage } from '../../src/admin/pages/CanvasEditorPage'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../src/foundation/shared/constants'

describe('CanvasEditorPage host layout', () => {
  it('renders the host editor as a dedicated canvas workspace', async () => {
    render(
      <CanvasEditorPage
        entry={{ data: { slug: 'home', title: 'Homepage' } }}
        api={{
          loadDocument: vi.fn().mockResolvedValue({
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
            _emcanvas: {
              enabled: true,
              version: CANVAS_DOCUMENT_VERSION,
              editorVersion: EMCANVAS_EDITOR_VERSION,
            },
          }),
          saveDocument: vi.fn().mockResolvedValue(undefined),
          getPreviewLink: vi.fn().mockReturnValue('/preview?slug=home'),
        }}
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'EmCanvas editor' }),
      ).toBeInTheDocument()
    })

    expect(screen.getByRole('main')).toHaveClass('emc-admin-editor-page')
    expect(
      screen.getByRole('banner', { name: 'Canvas editor header' }),
    ).toHaveClass('emc-admin-editor-page__topbar')
    expect(screen.getByLabelText('Canvas editor workspace')).toHaveClass(
      'emc-admin-editor-page__workspace',
    )
    expect(
      screen.queryByText('Dedicated canvas editor'),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('banner', { name: 'Editor toolbar' })).toHaveClass(
      'emc-editor-toolbar',
    )
    expect(
      screen.getByRole('group', { name: 'Canvas editor context' }),
    ).toHaveClass('emc-admin-editor-page__meta')
    expect(
      screen.getByRole('group', { name: 'Preview and publish actions' }),
    ).toHaveClass('emc-preview-actions')
    expect(
      screen.getByRole('contentinfo', { name: 'Editor statusbar' }),
    ).toHaveClass('emc-editor-statusbar')
    expect(screen.getByLabelText('Property inspector')).toHaveClass(
      'emc-editor-sidebar',
    )
    expect(screen.getByLabelText('Canvas surface')).toHaveClass(
      'emc-canvas-surface',
    )
  })
})
