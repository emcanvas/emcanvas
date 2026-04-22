import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EditorPage } from '../../src/plugin/pages/editor-page'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
} from '../../src/foundation/shared/constants'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import {
  loadCanvasDocumentState,
  serializeCanvasDocumentToEntryData,
} from '../../src/shared/persistence/canvas-document-entry'
import {
  createFixtureDocument,
  createFixtureHeadingNode,
} from '../fixtures/document-factory'

afterEach(() => {
  cleanup()
})

function createEditorDocument(): CanvasDocument {
  const document = createFixtureDocument()

  document.root.children = [createFixtureHeadingNode()]

  return document
}

describe('admin editor publish flow', () => {
  it('returns to clean after undo reaches the last published snapshot', async () => {
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
          enabled: true,
          version: CANVAS_DOCUMENT_VERSION,
          editorVersion: EMCANVAS_EDITOR_VERSION,
        },
      }),
      saveDocument: vi.fn().mockResolvedValue(undefined),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=home&source=emcanvas',
        ),
    }

    render(
      <EditorPage
        entry={entry}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Heading: Welcome' }),
      ).toBeInTheDocument()
    })

    expect(screen.getByText('All changes saved')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Heading: Welcome' }))
    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Draft heading' },
    })

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    expect(screen.getByText('All changes saved')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Draft heading again' },
    })

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))

    expect(screen.getByLabelText('Text')).toHaveValue('Draft heading')
    expect(screen.getByText('All changes saved')).toBeInTheDocument()
  })

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
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=home&source=emcanvas',
        ),
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

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Published heading' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument
    expect(publishedDocument.root.children?.[0]?.props.text).toBe(
      'Published heading',
    )
    expect(screen.getByText('All changes saved')).toBeInTheDocument()
    expect(screen.getByText('Changes published')).toBeInTheDocument()
    expect(screen.getByText('EmCanvas takeover enabled')).toBeInTheDocument()
  })

  it('reopens the persisted change through the shared loader/saver roundtrip', async () => {
    let persistedEntryData = serializeCanvasDocumentToEntryData({
      entryData: {
        slug: 'home',
        title: 'Homepage',
      },
      canvasLayout: createEditorDocument(),
    })

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=home&source=emcanvas',
        ),
    }

    const initialEntry = { data: persistedEntryData }
    const firstRender = render(
      <EditorPage
        entry={initialEntry}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Heading: Welcome' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Heading: Welcome' }))
    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Persisted heading' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Heading: Persisted heading' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Heading: Persisted heading' }),
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Persisted heading')
    })
  })

  it('creates, edits, publishes, and reloads the first block from an empty document', async () => {
    let persistedEntryData = {
      slug: 'empty-home',
      title: 'Empty homepage',
    }

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=empty-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'This canvas is empty. Add your first block to get started.',
        ),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add first heading' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Heading')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'My first heading' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument
    expect(publishedDocument.root.children).toHaveLength(1)
    expect(publishedDocument.root.children?.[0]?.type).toBe('heading')
    expect(publishedDocument.root.children?.[0]?.props.text).toBe(
      'My first heading',
    )

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Heading: My first heading' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Heading: My first heading' }),
    )

    expect(screen.getByLabelText('Text')).toHaveValue('My first heading')
  })

  it('creates, edits, publishes, and reloads the first text block from an empty document', async () => {
    let persistedEntryData = {
      slug: 'empty-text-home',
      title: 'Empty text homepage',
    }

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=empty-text-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'This canvas is empty. Add your first block to get started.',
        ),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add first text' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Lorem ipsum')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'My first paragraph' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument
    expect(publishedDocument.root.children).toHaveLength(1)
    expect(publishedDocument.root.children?.[0]?.type).toBe('text')
    expect(publishedDocument.root.children?.[0]?.props.text).toBe(
      'My first paragraph',
    )

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Text: My first paragraph' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Text: My first paragraph' }),
    )

    expect(screen.getByLabelText('Text')).toHaveValue('My first paragraph')
  })

  it('creates, edits, publishes, and reloads the first button block from an empty document', async () => {
    let persistedEntryData = {
      slug: 'empty-button-home',
      title: 'Empty button homepage',
    }

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=empty-button-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'This canvas is empty. Add your first block to get started.',
        ),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add first button' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toHaveValue('Click me')
    })

    fireEvent.change(screen.getByLabelText('Label'), {
      target: { value: 'Read more' },
    })
    fireEvent.change(screen.getByLabelText('Href'), {
      target: { value: '/read-more' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument
    expect(publishedDocument.root.children).toHaveLength(1)
    expect(publishedDocument.root.children?.[0]?.type).toBe('button')
    expect(publishedDocument.root.children?.[0]?.props.label).toBe('Read more')
    expect(publishedDocument.root.children?.[0]?.props.href).toBe('/read-more')

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Button: Read more' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Button: Read more' }))

    expect(screen.getByLabelText('Label')).toHaveValue('Read more')
    expect(screen.getByLabelText('Href')).toHaveValue('/read-more')
  })

  it('creates, edits, publishes, and reloads the first image block from an empty document', async () => {
    let persistedEntryData = {
      slug: 'empty-image-home',
      title: 'Empty image homepage',
    }

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=empty-image-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'This canvas is empty. Add your first block to get started.',
        ),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add first image' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Src')).toHaveValue('')
    })

    fireEvent.change(screen.getByLabelText('Src'), {
      target: { value: 'https://cdn.example.test/hero.jpg' },
    })
    fireEvent.change(screen.getByLabelText('Alt'), {
      target: { value: 'Homepage hero' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument
    expect(publishedDocument.root.children).toHaveLength(1)
    expect(publishedDocument.root.children?.[0]?.type).toBe('image')
    expect(publishedDocument.root.children?.[0]?.props.src).toBe(
      'https://cdn.example.test/hero.jpg',
    )
    expect(publishedDocument.root.children?.[0]?.props.alt).toBe(
      'Homepage hero',
    )

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Image: Homepage hero' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Image: Homepage hero' }),
    )

    expect(screen.getByLabelText('Src')).toHaveValue(
      'https://cdn.example.test/hero.jpg',
    )
    expect(screen.getByLabelText('Alt')).toHaveValue('Homepage hero')
  })

  it('creates, edits, publishes, and reloads the first hero block from an empty document', async () => {
    let persistedEntryData = {
      slug: 'empty-hero-home',
      title: 'Empty hero homepage',
    }

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=empty-hero-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'This canvas is empty. Add your first block to get started.',
        ),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add first hero' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue(
        'Build your next landing page',
      )
    })

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Launch faster with EmCanvas' },
    })
    fireEvent.change(screen.getByLabelText('Body'), {
      target: {
        value:
          'Compose a simple landing hero with headline, copy, CTA, and media.',
      },
    })
    fireEvent.change(screen.getByLabelText('CTA label'), {
      target: { value: 'Start building' },
    })
    fireEvent.change(screen.getByLabelText('CTA href'), {
      target: { value: '/start-building' },
    })
    fireEvent.change(screen.getByLabelText('Image src'), {
      target: { value: 'https://cdn.example.test/hero-card.jpg' },
    })
    fireEvent.change(screen.getByLabelText('Image alt'), {
      target: { value: 'Website builder preview' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument
    expect(publishedDocument.root.children).toHaveLength(1)
    expect(publishedDocument.root.children?.[0]).toMatchObject({
      type: 'hero',
      props: {
        title: 'Launch faster with EmCanvas',
        body: 'Compose a simple landing hero with headline, copy, CTA, and media.',
        ctaLabel: 'Start building',
        ctaHref: '/start-building',
        imageSrc: 'https://cdn.example.test/hero-card.jpg',
        imageAlt: 'Website builder preview',
      },
    })

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: 'Hero: Launch faster with EmCanvas',
        }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Hero: Launch faster with EmCanvas',
      }),
    )

    expect(screen.getByLabelText('Title')).toHaveValue(
      'Launch faster with EmCanvas',
    )
    expect(screen.getByLabelText('Body')).toHaveValue(
      'Compose a simple landing hero with headline, copy, CTA, and media.',
    )
    expect(screen.getByLabelText('CTA label')).toHaveValue('Start building')
    expect(screen.getByLabelText('CTA href')).toHaveValue('/start-building')
    expect(screen.getByLabelText('Image src')).toHaveValue(
      'https://cdn.example.test/hero-card.jpg',
    )
    expect(screen.getByLabelText('Image alt')).toHaveValue(
      'Website builder preview',
    )
  })

  it('creates, edits, publishes, and reloads the first columns layout from an empty document', async () => {
    let persistedEntryData = {
      slug: 'empty-columns-home',
      title: 'Empty columns homepage',
    }

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=empty-columns-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'This canvas is empty. Add your first block to get started.',
        ),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add first columns' }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Container' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add text inside' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Lorem ipsum')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Columns intro copy' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument
    expect(publishedDocument.root.children).toHaveLength(1)
    expect(publishedDocument.root.children?.[0]).toMatchObject({
      type: 'columns',
      props: { columns: 2 },
      children: [
        {
          type: 'container',
          children: [
            expect.objectContaining({
              type: 'text',
              props: expect.objectContaining({ text: 'Columns intro copy' }),
            }),
          ],
        },
        {
          type: 'container',
          children: [],
        },
      ],
    })

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Text: Columns intro copy' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Text: Columns intro copy' }),
    )

    expect(screen.getByLabelText('Text')).toHaveValue('Columns intro copy')
  })

  it('publishes an invalid button href as a safe fallback and reloads the normalized value', async () => {
    let persistedEntryData = {
      slug: 'invalid-button-home',
      title: 'Invalid button homepage',
    }

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=invalid-button-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'This canvas is empty. Add your first block to get started.',
        ),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add first button' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Href')).toHaveValue('#')
    })

    fireEvent.change(screen.getByLabelText('Label'), {
      target: { value: 'Unsafe button' },
    })
    fireEvent.change(screen.getByLabelText('Href'), {
      target: { value: 'javascript:alert(1)' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    expect(
      (persistedEntryData as { canvasLayout?: CanvasDocument }).canvasLayout
        ?.root.children?.[0]?.props.label,
    ).toBe('Unsafe button')
    expect(
      (persistedEntryData as { canvasLayout?: CanvasDocument }).canvasLayout
        ?.root.children?.[0]?.props.href,
    ).toBe('#')

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Button: Unsafe button' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Button: Unsafe button' }),
    )

    expect(screen.getByLabelText('Label')).toHaveValue('Unsafe button')
    expect(screen.getByLabelText('Href')).toHaveValue('#')
  })

  it('inserts a new block into an existing document, publishes it, and reloads the persisted result', async () => {
    let persistedEntryData = serializeCanvasDocumentToEntryData({
      entryData: {
        slug: 'existing-home',
        title: 'Existing homepage',
      },
      canvasLayout: createEditorDocument(),
    })

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=existing-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Heading: Welcome' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Heading: Welcome' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Welcome')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add text below' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Lorem ipsum')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Persisted paragraph' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument

    expect(publishedDocument.root.children?.map((node) => node.type)).toEqual([
      'heading',
      'text',
    ])
    expect(publishedDocument.root.children?.[1]?.props.text).toBe(
      'Persisted paragraph',
    )

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Text: Persisted paragraph' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Text: Persisted paragraph' }),
    )

    expect(screen.getByLabelText('Text')).toHaveValue('Persisted paragraph')
  })

  it('deletes a selected block, publishes, and reloads the persisted result', async () => {
    let persistedEntryData = serializeCanvasDocumentToEntryData({
      entryData: {
        slug: 'delete-home',
        title: 'Delete homepage',
      },
      canvasLayout: {
        ...createEditorDocument(),
        root: {
          ...createEditorDocument().root,
          children: [
            createFixtureHeadingNode('Welcome'),
            {
              id: 'text-1',
              type: 'text',
              props: { text: 'Delete me' },
              styles: { desktop: {} },
              children: [],
            },
          ],
        },
      },
    })

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=delete-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Text: Delete me' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Text: Delete me' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Delete me')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Delete block' }))
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument

    expect(publishedDocument.root.children?.map((node) => node.type)).toEqual([
      'heading',
    ])
    expect(
      screen.queryByRole('button', { name: 'Text: Delete me' }),
    ).not.toBeInTheDocument()

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Heading: Welcome' }),
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByRole('button', { name: 'Text: Delete me' }),
    ).not.toBeInTheDocument()
  })

  it('adds a block inside a section, publishes, and reloads the nested result', async () => {
    let persistedEntryData = serializeCanvasDocumentToEntryData({
      entryData: {
        slug: 'nested-section-home',
        title: 'Nested section homepage',
      },
      canvasLayout: {
        ...createEditorDocument(),
        root: {
          ...createEditorDocument().root,
          children: [
            {
              id: 'section-1',
              type: 'section',
              props: {},
              styles: { desktop: {} },
              children: [],
            },
          ],
        },
      },
    })

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=nested-section-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        firstRender.container.querySelector('[data-node-id="section-1"]'),
      ).not.toBeNull()
    })

    const sectionNode = firstRender.container.querySelector(
      '[data-node-id="section-1"]',
    )

    expect(sectionNode).not.toBeNull()

    fireEvent.click(
      within(sectionNode as HTMLElement).getByRole('button', {
        name: 'Section',
      }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Add text inside' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add text inside' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Lorem ipsum')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Nested paragraph' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument

    expect(publishedDocument.root.children?.[0]).toMatchObject({
      id: 'section-1',
      type: 'section',
      children: [
        expect.objectContaining({
          type: 'text',
          props: expect.objectContaining({ text: 'Nested paragraph' }),
        }),
      ],
    })

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Text: Nested paragraph' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Text: Nested paragraph' }),
    )

    expect(screen.getByLabelText('Text')).toHaveValue('Nested paragraph')
  })

  it('adds a block inside a container, publishes, and reloads the persisted nested result', async () => {
    let persistedEntryData = serializeCanvasDocumentToEntryData({
      entryData: {
        slug: 'nested-container-home',
        title: 'Nested container homepage',
      },
      canvasLayout: {
        ...createEditorDocument(),
        root: {
          ...createEditorDocument().root,
          children: [
            {
              id: 'section-1',
              type: 'section',
              props: {},
              styles: { desktop: {} },
              children: [
                {
                  id: 'container-1',
                  type: 'container',
                  props: {},
                  styles: { desktop: {} },
                  children: [],
                },
              ],
            },
          ],
        },
      },
    })

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=nested-container-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        firstRender.container.querySelector('[data-node-id="container-1"]'),
      ).not.toBeNull()
    })

    const containerNode = firstRender.container.querySelector(
      '[data-node-id="container-1"]',
    )

    expect(containerNode).not.toBeNull()

    fireEvent.click(
      within(containerNode as HTMLElement).getByRole('button', {
        name: 'Container',
      }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Add text inside' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add text inside' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Lorem ipsum')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Container paragraph' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument

    expect(publishedDocument.root.children?.[0]).toMatchObject({
      id: 'section-1',
      type: 'section',
      children: [
        expect.objectContaining({
          id: 'container-1',
          type: 'container',
          children: [
            expect.objectContaining({
              type: 'text',
              props: expect.objectContaining({ text: 'Container paragraph' }),
            }),
          ],
        }),
      ],
    })

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Text: Container paragraph' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Text: Container paragraph' }),
    )

    expect(screen.getByLabelText('Text')).toHaveValue('Container paragraph')
  })

  it('adds a container inside columns, publishes nested content, and reloads the persisted layout', async () => {
    let persistedEntryData = serializeCanvasDocumentToEntryData({
      entryData: {
        slug: 'columns-container-home',
        title: 'Columns container homepage',
      },
      canvasLayout: {
        ...createEditorDocument(),
        root: {
          ...createEditorDocument().root,
          children: [
            {
              id: 'section-1',
              type: 'section',
              props: {},
              styles: { desktop: {} },
              children: [
                {
                  id: 'columns-1',
                  type: 'columns',
                  props: { columns: 2 },
                  styles: { desktop: {} },
                  children: [],
                },
              ],
            },
          ],
        },
      },
    })

    const api = {
      loadDocument: vi
        .fn()
        .mockImplementation(async () =>
          loadCanvasDocumentState(persistedEntryData),
        ),
      saveDocument: vi
        .fn()
        .mockImplementation(
          async ({ canvasLayout }: { canvasLayout: CanvasDocument }) => {
            persistedEntryData = serializeCanvasDocumentToEntryData({
              entryData: persistedEntryData,
              canvasLayout,
            })

            return persistedEntryData
          },
        ),
      getPreviewLink: vi
        .fn()
        .mockReturnValue(
          'https://example.test/preview?slug=columns-container-home&source=emcanvas',
        ),
    }

    const firstRender = render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        firstRender.container.querySelector('[data-node-id="columns-1"]'),
      ).not.toBeNull()
    })

    const columnsNode = firstRender.container.querySelector(
      '[data-node-id="columns-1"]',
    )

    expect(columnsNode).not.toBeNull()

    fireEvent.click(
      within(columnsNode as HTMLElement).getByRole('button', {
        name: 'Columns',
      }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Add container inside' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Add container inside' }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Add text inside' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add text inside' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Lorem ipsum')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Column paragraph' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument

    expect(publishedDocument.root.children?.[0]).toMatchObject({
      id: 'section-1',
      type: 'section',
      children: [
        expect.objectContaining({
          id: 'columns-1',
          type: 'columns',
          children: [
            expect.objectContaining({
              type: 'container',
              children: [
                expect.objectContaining({
                  type: 'text',
                  props: expect.objectContaining({ text: 'Column paragraph' }),
                }),
              ],
            }),
          ],
        }),
      ],
    })

    firstRender.unmount()

    render(
      <EditorPage
        entry={{ data: persistedEntryData }}
        api={api}
        previewOrigin="https://example.test"
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Text: Column paragraph' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Text: Column paragraph' }),
    )

    expect(screen.getByLabelText('Text')).toHaveValue('Column paragraph')
  })
})
