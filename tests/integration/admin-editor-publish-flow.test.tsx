import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EditorPage } from '../../src/plugin/pages/editor-page'
import { CANVAS_DOCUMENT_VERSION, EMCANVAS_EDITOR_VERSION } from '../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import { saveDocument } from '../../src/editor/persistence/save-document'

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
      children: [
        {
          id: 'heading-1',
          type: 'heading',
          props: {
            text: 'Welcome',
            level: 2,
          },
          styles: { desktop: {} },
          children: [],
        },
      ],
    },
    settings: {},
  }
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
        canvasLayout: createFixtureDocument(),
        _emcanvas: {
          enabled: false,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      }),
      saveDocument: vi.fn(async ({ entry: nextEntry, canvasLayout }: { entry: typeof entry; canvasLayout: CanvasDocument }) =>
        saveDocument({ entry: nextEntry, canvasLayout }),
      ),
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
    expect((entry.data.canvasLayout as CanvasDocument).root.children?.[0]?.props.text).toBe(
      'Published heading',
    )
    expect(screen.getByText('Changes published')).toBeInTheDocument()
    expect(screen.getByText('EmCanvas takeover enabled')).toBeInTheDocument()
  })
})
