import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EditorPage } from '../../src/plugin/pages/editor-page'
import { CANVAS_DOCUMENT_VERSION, EMCANVAS_EDITOR_VERSION } from '../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import { createFixtureDocument, createFixtureHeadingNode } from '../fixtures/document-factory'

afterEach(() => {
  cleanup()
})

function createEditorDocument(): CanvasDocument {
  const document = createFixtureDocument()

  document.root.children = [createFixtureHeadingNode()]

  return document
}

describe('admin editor publish flow', () => {
  it('publishes the document currently edited through the plugin editor page', async () => {
    const entry = {
      data: {
        slug: 'home',
        title: 'Homepage',
      },
    }
    const api = {
      loadDocument: vi.fn().mockResolvedValue({
        canvasLayout: createEditorDocument(),
        _emcanvas: {
          enabled: false,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      }),
      saveDocument: vi.fn().mockResolvedValue(undefined),
      getPreviewLink: vi.fn().mockReturnValue('https://example.test/preview?slug=home&source=emcanvas'),
    }

    let readyInstance:
      | {
          store: { selectNode: (nodeId: string) => void }
        }
      | undefined

    render(
      <EditorPage
        entry={entry}
        api={api}
        previewOrigin="https://example.test"
        onEditorReady={(instance) => {
          readyInstance = instance
        }}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('EmCanvas takeover disabled')).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: 'Open preview' })).toHaveAttribute(
      'href',
      'https://example.test/preview?slug=home&source=emcanvas',
    )

    await waitFor(() => {
      expect(readyInstance).toBeDefined()
    })

    act(() => {
      readyInstance?.store.selectNode('heading-1')
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Welcome')
    })

    fireEvent.change(screen.getByLabelText('Text'), { target: { value: 'Published heading' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]?.canvasLayout as CanvasDocument
    expect(publishedDocument.root.children?.[0]?.props.text).toBe('Published heading')
    expect(screen.getByText('Changes published')).toBeInTheDocument()
    expect(screen.getByText('EmCanvas takeover enabled')).toBeInTheDocument()
  })
})
