import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EditorPage } from '../../src/plugin/pages/editor-page'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import {
  loadCanvasDocumentState,
  serializeCanvasDocumentToEntryData,
} from '../../src/shared/persistence/canvas-document-entry'

describe('landing page MVP smoke flow', () => {
  it('builds, publishes, reloads, and preserves a minimal landing page from an empty entry', async () => {
    let persistedEntryData = {
      slug: 'landing-mvp-home',
      title: 'Landing MVP homepage',
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
          'https://example.test/preview?slug=landing-mvp-home&source=emcanvas',
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
      target: { value: 'Launch your next campaign faster' },
    })
    fireEvent.change(screen.getByLabelText('Body'), {
      target: {
        value:
          'Build a simple landing page with one hero, one benefits section, and a clean publish flow.',
      },
    })
    fireEvent.change(screen.getByLabelText('CTA label'), {
      target: { value: 'Start building' },
    })
    fireEvent.change(screen.getByLabelText('CTA href'), {
      target: { value: '/start-building' },
    })
    fireEvent.change(screen.getByLabelText('Image src'), {
      target: { value: 'https://cdn.example.test/landing-hero.jpg' },
    })
    fireEvent.change(screen.getByLabelText('Image alt'), {
      target: { value: 'Landing page hero preview' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Add features/cards below' }),
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Card 1 title')).toHaveValue(
        'Visual editing',
      )
    })

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Why teams can ship with the MVP' },
    })
    fireEvent.change(screen.getByLabelText('Intro'), {
      target: {
        value:
          'The minimal website-builder loop is enough to compose, publish, reload, and render a basic landing page.',
      },
    })
    fireEvent.change(screen.getByLabelText('Card 1 title'), {
      target: { value: 'Hero section' },
    })
    fireEvent.change(screen.getByLabelText('Card 1 body'), {
      target: { value: 'Lead with headline, body copy, CTA, and image.' },
    })
    fireEvent.change(screen.getByLabelText('Card 2 title'), {
      target: { value: 'Benefits grid' },
    })
    fireEvent.change(screen.getByLabelText('Card 2 body'), {
      target: {
        value: 'Reinforce the value proposition with three compact cards.',
      },
    })
    fireEvent.change(screen.getByLabelText('Card 3 title'), {
      target: { value: 'SSR output' },
    })
    fireEvent.change(screen.getByLabelText('Card 3 body'), {
      target: {
        value: 'Publish the same document structure that the frontend renders.',
      },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => {
      expect(api.saveDocument).toHaveBeenCalledOnce()
    })

    const publishedDocument = api.saveDocument.mock.calls[0]?.[0]
      ?.canvasLayout as CanvasDocument

    expect(publishedDocument.root.children).toHaveLength(2)
    expect(publishedDocument.root.children?.[0]).toMatchObject({
      type: 'hero',
      props: {
        title: 'Launch your next campaign faster',
        body: 'Build a simple landing page with one hero, one benefits section, and a clean publish flow.',
        ctaLabel: 'Start building',
        ctaHref: '/start-building',
        imageSrc: 'https://cdn.example.test/landing-hero.jpg',
        imageAlt: 'Landing page hero preview',
      },
    })
    expect(publishedDocument.root.children?.[1]).toMatchObject({
      type: 'features/cards',
      props: {
        title: 'Why teams can ship with the MVP',
        intro:
          'The minimal website-builder loop is enough to compose, publish, reload, and render a basic landing page.',
        card1Title: 'Hero section',
        card2Title: 'Benefits grid',
        card3Title: 'SSR output',
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
          name: 'Hero: Launch your next campaign faster',
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', {
          name: 'Features / Cards: Why teams can ship with the MVP',
        }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Hero: Launch your next campaign faster',
      }),
    )

    expect(screen.getByLabelText('CTA href')).toHaveValue('/start-building')
    expect(screen.getByLabelText('Image alt')).toHaveValue(
      'Landing page hero preview',
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Features / Cards: Why teams can ship with the MVP',
      }),
    )

    expect(screen.getByLabelText('Card 2 title')).toHaveValue('Benefits grid')
    expect(screen.getByLabelText('Card 3 body')).toHaveValue(
      'Publish the same document structure that the frontend renders.',
    )
  })
})
