import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EditorPage } from '../../src/plugin/pages/editor-page'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import {
  loadCanvasDocumentState,
  serializeCanvasDocumentToEntryData,
} from '../../src/shared/persistence/canvas-document-entry'

describe('editor MVP smoke flow', () => {
  it('supports empty document to columns content publish and reload without breaking the layout', async () => {
    let persistedEntryData = {
      slug: 'mvp-columns-home',
      title: 'MVP columns homepage',
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
          'https://example.test/preview?slug=mvp-columns-home&source=emcanvas',
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

    const containers = firstRender.container.querySelectorAll(
      '[data-node-type="container"]',
    )
    expect(containers).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Add heading inside' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Heading')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Column heading' },
    })

    fireEvent.click(
      within(containers[1] as HTMLElement).getByRole('button', {
        name: 'Container',
      }),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Add text inside' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Text')).toHaveValue('Lorem ipsum')
    })

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'Column paragraph' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add button below' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toHaveValue('Click me')
    })

    fireEvent.change(screen.getByLabelText('Label'), {
      target: { value: 'Read more' },
    })
    fireEvent.change(screen.getByLabelText('Href'), {
      target: { value: '/read-more' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Delete block' }))

    expect(
      screen.queryByRole('button', { name: 'Button: Read more' }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument

    expect(publishedDocument.root.children?.[0]).toMatchObject({
      type: 'columns',
      props: { columns: 2 },
      children: [
        {
          type: 'container',
          children: [
            expect.objectContaining({
              type: 'heading',
              props: expect.objectContaining({ text: 'Column heading' }),
            }),
          ],
        },
        {
          type: 'container',
          children: [
            expect.objectContaining({
              type: 'text',
              props: expect.objectContaining({ text: 'Column paragraph' }),
            }),
          ],
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
        screen.getByRole('button', { name: 'Heading: Column heading' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Text: Column paragraph' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Heading: Column heading' }),
    )
    expect(screen.getByLabelText('Text')).toHaveValue('Column heading')

    fireEvent.click(
      screen.getByRole('button', { name: 'Text: Column paragraph' }),
    )
    expect(screen.getByLabelText('Text')).toHaveValue('Column paragraph')
    expect(
      screen.queryByRole('button', { name: 'Button: Read more' }),
    ).not.toBeInTheDocument()
  })
})
