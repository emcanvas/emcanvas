import { act, cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EditorShell } from '@emcanvas/editor/shell/editor-shell'
import { createDefaultCanvasDocument } from '@emcanvas/foundation/model/document-factory'
import type { CanvasDocument } from '@emcanvas/foundation/types/canvas'
import type { EditorStore } from '@emcanvas/editor/state/editor-store'
import {
  createFixtureDocument,
  createFixtureHeadingNode,
} from '../fixtures/document-factory'

function createFixtureDocumentWithHeading(text: string): CanvasDocument {
  const document = createFixtureDocument()

  document.root.children = [createFixtureHeadingNode(text)]

  return document
}

function selectHeadingForEditing(
  store: EditorStore<CanvasDocument> | undefined,
) {
  act(() => {
    store?.selectNode('heading-1')
  })
}

afterEach(() => {
  cleanup()
})

describe('editor shell flow', () => {
  it('renders a compact canvas shell with toolbar, canvas, sidebar, and statusbar', () => {
    const view = render(<EditorShell />)

    expect(view.getByLabelText('Editor toolbar')).toHaveClass(
      'emc-editor-toolbar',
    )
    expect(view.getByLabelText('Canvas viewport')).toHaveClass(
      'emc-canvas-viewport',
    )
    expect(view.getByLabelText('Canvas viewport')).toBeInTheDocument()
    expect(view.getByLabelText('Property inspector')).toBeInTheDocument()
    expect(view.getByLabelText('Editor statusbar')).toBeInTheDocument()
  })

  it('starts from a valid empty layout and shows curated canvas quick actions', () => {
    const view = render(
      <EditorShell initialDocument={createDefaultCanvasDocument()} />,
    )

    expect(
      view.getByText(
        'Empty canvas. Start with a section or a ready-made block.',
      ),
    ).toBeInTheDocument()
    expect(
      view.getByRole('heading', { name: 'Start from scratch' }),
    ).toBeInTheDocument()
    expect(
      view.getByText(
        'The layout is valid and intentionally blank. Add your first block when you are ready.',
      ),
    ).toBeInTheDocument()
    expect(
      view.getByRole('button', { name: 'Add section' }),
    ).toBeInTheDocument()
    expect(view.getByRole('button', { name: 'Add hero' })).toBeInTheDocument()
    expect(
      view.getByRole('button', { name: 'Add columns' }),
    ).toBeInTheDocument()
    expect(
      view.getByRole('button', { name: 'Add heading' }),
    ).toBeInTheDocument()
    expect(
      view.queryByRole('button', { name: 'Add first text' }),
    ).not.toBeInTheDocument()
    expect(
      view.queryByRole('button', { name: 'Add first button' }),
    ).not.toBeInTheDocument()
    expect(
      view.queryByRole('button', { name: 'Add first image' }),
    ).not.toBeInTheDocument()
    expect(
      view.queryByRole('button', { name: 'Add first features/cards' }),
    ).not.toBeInTheDocument()
  })

  it('shows an empty-state affordance and selects the created first heading', () => {
    const view = render(
      <EditorShell initialDocument={createDefaultCanvasDocument()} />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Add heading' }))

    expect(
      view.getByRole('button', { name: 'Heading: Heading' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Text')).toHaveValue('Heading')
    expect(view.getByText('Unsaved changes')).toBeInTheDocument()
  })

  it('lets the empty-state create and select the first section block', () => {
    const view = render(
      <EditorShell initialDocument={createDefaultCanvasDocument()} />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Add section' }))

    expect(
      view.container.querySelectorAll('[data-node-type="section"]'),
    ).toHaveLength(2)
    expect(view.getByRole('heading', { name: 'Section' })).toBeInTheDocument()
    expect(
      view.getByRole('button', { name: 'Add heading inside' }),
    ).toBeInTheDocument()
    expect(view.getByText('Unsaved changes')).toBeInTheDocument()
  })

  it('lets the empty-state create and select the first hero block', () => {
    const view = render(
      <EditorShell initialDocument={createDefaultCanvasDocument()} />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Add hero' }))

    expect(
      view.getByRole('button', { name: 'Hero: Build your next landing page' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Title')).toHaveValue(
      'Build your next landing page',
    )
    expect(view.getByLabelText('CTA label')).toHaveValue('Get started')
    expect(view.getByText('Unsaved changes')).toBeInTheDocument()
  })

  it('lets the empty-state create columns with default containers and immediately edit inside the first one', () => {
    const view = render(
      <EditorShell initialDocument={createDefaultCanvasDocument()} />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Add columns' }))

    expect(
      view.container.querySelector('[data-node-type="columns"]'),
    ).not.toBeNull()
    expect(
      view.container.querySelectorAll('[data-node-type="container"]'),
    ).toHaveLength(2)
    expect(view.getByRole('heading', { name: 'Container' })).toBeInTheDocument()
    expect(
      view.getByRole('button', { name: 'Add text inside' }),
    ).toBeInTheDocument()

    fireEvent.click(view.getByRole('button', { name: 'Add text inside' }))

    expect(view.getByLabelText('Text')).toHaveValue('Lorem ipsum')

    fireEvent.change(view.getByLabelText('Text'), {
      target: { value: 'First column paragraph' },
    })

    expect(
      view.getByRole('button', { name: 'Text: First column paragraph' }),
    ).toBeInTheDocument()
  })

  it('adds a new block below the selected node and selects it for editing', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Heading: Welcome' }))
    fireEvent.click(view.getByRole('button', { name: 'Add text below' }))

    expect(
      view.getByRole('button', { name: 'Text: Lorem ipsum' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Text')).toHaveValue('Lorem ipsum')

    fireEvent.change(view.getByLabelText('Text'), {
      target: { value: 'Inserted paragraph' },
    })

    expect(
      view.getByRole('button', { name: 'Text: Inserted paragraph' }),
    ).toBeInTheDocument()
  })

  it('adds a new block inside a selected section and selects it for editing', () => {
    const document = createFixtureDocument()

    document.root.children = [
      {
        id: 'section-1',
        type: 'section',
        props: {},
        styles: { desktop: {} },
        children: [],
      },
    ]

    const view = render(<EditorShell initialDocument={document} />)
    const sectionNode = view.container.querySelector(
      '[data-node-id="section-1"]',
    )

    expect(sectionNode).not.toBeNull()

    fireEvent.click(
      within(sectionNode as HTMLElement).getByRole('button', {
        name: 'Section',
      }),
    )
    fireEvent.click(view.getByRole('button', { name: 'Add heading inside' }))

    expect(
      view.getByRole('button', { name: 'Heading: Heading' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Text')).toHaveValue('Heading')
  })

  it('adds a new block inside a selected container and lets the nested block be edited', () => {
    const document = createFixtureDocument()

    document.root.children = [
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
    ]

    const view = render(<EditorShell initialDocument={document} />)
    const containerNode = view.container.querySelector(
      '[data-node-id="container-1"]',
    )

    expect(containerNode).not.toBeNull()

    fireEvent.click(
      within(containerNode as HTMLElement).getByRole('button', {
        name: 'Container',
      }),
    )
    fireEvent.click(view.getByRole('button', { name: 'Add text inside' }))

    expect(
      view.getByRole('button', { name: 'Text: Lorem ipsum' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Text')).toHaveValue('Lorem ipsum')

    fireEvent.change(view.getByLabelText('Text'), {
      target: { value: 'Container paragraph' },
    })

    expect(
      view.getByRole('button', { name: 'Text: Container paragraph' }),
    ).toBeInTheDocument()
  })

  it('adds a container inside selected columns, then adds editable content inside that container', () => {
    const document = createFixtureDocument()

    document.root.children = [
      {
        id: 'columns-1',
        type: 'columns',
        props: { columns: 2 },
        styles: { desktop: {} },
        children: [],
      },
    ]

    const view = render(<EditorShell initialDocument={document} />)
    const columnsNode = view.container.querySelector(
      '[data-node-id="columns-1"]',
    )

    expect(columnsNode).not.toBeNull()

    fireEvent.click(
      within(columnsNode as HTMLElement).getByRole('button', {
        name: 'Columns',
      }),
    )
    fireEvent.click(view.getByRole('button', { name: 'Add container inside' }))

    expect(
      view.container.querySelector('[data-node-type="container"]'),
    ).not.toBeNull()

    fireEvent.click(view.getByRole('button', { name: 'Add text inside' }))

    expect(
      view.getByRole('button', { name: 'Text: Lorem ipsum' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Text')).toHaveValue('Lorem ipsum')

    fireEvent.change(view.getByLabelText('Text'), {
      target: { value: 'Column paragraph' },
    })

    expect(
      view.getByRole('button', { name: 'Text: Column paragraph' }),
    ).toBeInTheDocument()
  })

  it('adds a button below the selected node and updates its basic props', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Heading: Welcome' }))
    fireEvent.click(view.getByRole('button', { name: 'Add button below' }))

    expect(
      view.getByRole('button', { name: 'Button: Click me' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Label')).toHaveValue('Click me')
    expect(view.getByLabelText('Href')).toHaveValue('#')

    fireEvent.change(view.getByLabelText('Label'), {
      target: { value: 'Read more' },
    })
    fireEvent.change(view.getByLabelText('Href'), {
      target: { value: '/read-more' },
    })

    expect(
      view.getByRole('button', { name: 'Button: Read more' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Href')).toHaveValue('/read-more')
  })

  it('adds an image below the selected node and updates its basic props', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Heading: Welcome' }))
    fireEvent.click(view.getByRole('button', { name: 'Add image below' }))

    expect(view.getByRole('heading', { name: 'Image' })).toBeInTheDocument()
    expect(view.getByLabelText('Src')).toHaveValue('')
    expect(view.getByLabelText('Alt')).toHaveValue('')

    fireEvent.change(view.getByLabelText('Src'), {
      target: { value: 'https://cdn.example.test/hero.jpg' },
    })
    fireEvent.change(view.getByLabelText('Alt'), {
      target: { value: 'Hero banner' },
    })

    expect(
      view.getByRole('button', { name: 'Image: Hero banner' }),
    ).toBeInTheDocument()
    expect(view.getByLabelText('Src')).toHaveValue(
      'https://cdn.example.test/hero.jpg',
    )
  })

  it('deletes the selected block and moves selection to a sibling', () => {
    const document = createFixtureDocumentWithHeading('Welcome')

    document.root.children?.push({
      id: 'text-1',
      type: 'text',
      props: { text: 'Body copy' },
      styles: { desktop: {} },
      children: [],
    })

    const view = render(<EditorShell initialDocument={document} />)

    fireEvent.click(view.getByRole('button', { name: 'Text: Body copy' }))

    expect(view.getByLabelText('Text')).toHaveValue('Body copy')

    fireEvent.click(view.getByRole('button', { name: 'Delete block' }))

    expect(
      view.queryByRole('button', { name: 'Text: Body copy' }),
    ).not.toBeInTheDocument()
    expect(
      view.getByRole('button', { name: 'Heading: Welcome' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(view.getByLabelText('Text')).toHaveValue('Welcome')
  })

  it('returns to the empty state after deleting the only block', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Solo heading')}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Heading: Solo heading' }))
    fireEvent.click(view.getByRole('button', { name: 'Delete block' }))

    expect(
      view.getByText(
        'The layout is valid and intentionally blank. Add your first block when you are ready.',
      ),
    ).toBeInTheDocument()
    expect(
      view.getByText('Use the canvas quick actions to place your first block.'),
    ).toBeInTheDocument()
  })

  it('adds a new block to the page when existing content has no selection', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Add heading to page' }))

    expect(
      view.getAllByRole('button', { name: 'Heading: Heading' }),
    ).toHaveLength(1)
    expect(view.getByLabelText('Text')).toHaveValue('Heading')
  })

  it('adds columns to the page when existing content has no selection and focuses the first container', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Add columns to page' }))

    expect(
      view.container.querySelectorAll('[data-node-type="columns"]'),
    ).toHaveLength(1)
    expect(
      view.container.querySelectorAll('[data-node-type="container"]'),
    ).toHaveLength(2)
    expect(view.getByRole('heading', { name: 'Container' })).toBeInTheDocument()
    expect(
      view.getByRole('button', { name: 'Add text inside' }),
    ).toBeInTheDocument()
  })

  it('keeps each mounted shell isolated through visible state changes', () => {
    const stores: Array<EditorStore<CanvasDocument> | undefined> = []
    const firstDocument = createFixtureDocumentWithHeading('First heading')
    const secondDocument = createFixtureDocumentWithHeading('Second heading')

    const view = render(
      <>
        <section data-testid="first-shell">
          <EditorShell
            initialDocument={firstDocument}
            onEditorReady={({ store }) => {
              stores[0] = store
            }}
          />
        </section>
        <section data-testid="second-shell">
          <EditorShell
            initialDocument={secondDocument}
            onEditorReady={({ store }) => {
              stores[1] = store
            }}
          />
        </section>
      </>,
    )

    const firstShell = within(view.getByTestId('first-shell'))
    const secondShell = within(view.getByTestId('second-shell'))

    expect(
      firstShell.getByText('Select a node to edit its content and styles.'),
    ).toBeInTheDocument()
    expect(
      secondShell.getByText('Select a node to edit its content and styles.'),
    ).toBeInTheDocument()

    selectHeadingForEditing(stores[0])
    selectHeadingForEditing(stores[1])

    expect(firstShell.getByLabelText('Text')).toHaveValue('First heading')
    expect(secondShell.getByLabelText('Text')).toHaveValue('Second heading')

    fireEvent.change(secondShell.getByLabelText('Text'), {
      target: { value: 'Second heading updated' },
    })

    expect(firstShell.getByLabelText('Text')).toHaveValue('First heading')
    expect(firstShell.getByText('All changes saved')).toBeInTheDocument()
    expect(firstShell.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(secondShell.getByLabelText('Text')).toHaveValue(
      'Second heading updated',
    )
    expect(secondShell.getByText('Unsaved changes')).toBeInTheDocument()
    expect(secondShell.getByRole('button', { name: 'Undo' })).toBeEnabled()
  })

  it('updates visible shell state after sidebar edits', () => {
    let store: EditorStore<CanvasDocument> | undefined

    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
        onEditorReady={(instance) => {
          store = instance.store
        }}
      />,
    )

    const shell = within(view.container)

    expect(shell.getByText('Breakpoint: desktop')).toBeInTheDocument()
    expect(shell.getByText('All changes saved')).toBeInTheDocument()
    expect(shell.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(
      view.getByText('Select a node to edit its content and styles.'),
    ).toBeInTheDocument()

    selectHeadingForEditing(store)

    fireEvent.click(view.getByRole('button', { name: 'Mobile' }))
    fireEvent.change(view.getByLabelText('Text'), {
      target: { value: 'Updated heading' },
    })

    expect(shell.getByText('Breakpoint: mobile')).toBeInTheDocument()
    expect(shell.getByText('Unsaved changes')).toBeInTheDocument()
    expect(shell.getByRole('button', { name: 'Undo' })).toBeEnabled()
    expect(view.getByLabelText('Text')).toHaveValue('Updated heading')
  })

  it('selects nodes directly from the canvas viewport', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    expect(
      view.getByText('Select a node to edit its content and styles.'),
    ).toBeInTheDocument()

    fireEvent.click(view.getByRole('button', { name: 'Heading: Welcome' }))

    const breadcrumbs = within(view.getByLabelText('Canvas breadcrumbs'))

    expect(view.getByLabelText('Text')).toHaveValue('Welcome')
    expect(
      breadcrumbs.getByRole('button', { name: 'Section' }),
    ).toHaveAttribute('aria-current', 'false')
    expect(
      breadcrumbs.getByRole('button', { name: 'Heading' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  it('shows a neutral canvas hint when content exists but nothing is selected', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    expect(
      view.getByText('Select a block on the canvas to inspect and edit it.'),
    ).toBeInTheDocument()
  })

  it('shows the selected block name and marks the node as selected', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    const nodeButton = view.getByRole('button', { name: 'Heading: Welcome' })

    fireEvent.click(nodeButton)

    expect(view.getByText('Selected block: Heading')).toBeInTheDocument()
    expect(nodeButton.closest('[data-node-id="heading-1"]')).toHaveAttribute(
      'data-selected',
      'true',
    )
  })

  it('routes live sidebar prop and style edits through undoable history', () => {
    let store: EditorStore<CanvasDocument> | undefined

    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
        onEditorReady={(instance) => {
          store = instance.store
        }}
      />,
    )

    expect(
      view.getByText('Select a node to edit its content and styles.'),
    ).toBeInTheDocument()

    selectHeadingForEditing(store)

    fireEvent.change(view.getByLabelText('Text'), {
      target: { value: 'Updated heading' },
    })
    fireEvent.change(view.getByLabelText('Padding'), {
      target: { value: '24px' },
    })
    fireEvent.change(view.getByLabelText('Color'), {
      target: { value: '#ff0000' },
    })

    expect(view.getByLabelText('Text')).toHaveValue('Updated heading')
    expect(view.getByLabelText('Padding')).toHaveValue('24px')
    expect(view.getByLabelText('Color')).toHaveValue('#ff0000')
    expect(
      view.container.querySelector('style[data-emcanvas-editor-styles]')
        ?.textContent,
    ).toContain('[data-emcanvas-node="heading-1"]{padding:24px;color:#ff0000;}')

    fireEvent.click(view.getByRole('button', { name: 'Undo' }))

    expect(view.getByLabelText('Text')).toHaveValue('Updated heading')
    expect(view.getByLabelText('Padding')).toHaveValue('24px')
    expect(view.getByLabelText('Color')).toHaveValue('')

    fireEvent.click(view.getByRole('button', { name: 'Undo' }))

    expect(view.getByLabelText('Padding')).toHaveValue('')

    fireEvent.click(view.getByRole('button', { name: 'Undo' }))

    expect(view.getByLabelText('Text')).toHaveValue('Welcome')

    fireEvent.click(view.getByRole('button', { name: 'Redo' }))
    fireEvent.click(view.getByRole('button', { name: 'Redo' }))
    fireEvent.click(view.getByRole('button', { name: 'Redo' }))

    expect(view.getByLabelText('Text')).toHaveValue('Updated heading')
    expect(view.getByLabelText('Padding')).toHaveValue('24px')
    expect(view.getByLabelText('Color')).toHaveValue('#ff0000')
  })

  it('restores the selected block and toolbar state across add undo redo', () => {
    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Heading: Welcome' }))
    fireEvent.click(view.getByRole('button', { name: 'Add button below' }))

    expect(view.getByLabelText('Label')).toHaveValue('Click me')
    expect(view.getByRole('button', { name: 'Undo' })).toBeEnabled()
    expect(view.getByRole('button', { name: 'Redo' })).toBeDisabled()

    fireEvent.click(view.getByRole('button', { name: 'Undo' }))

    expect(
      view.queryByRole('button', { name: 'Button: Click me' }),
    ).not.toBeInTheDocument()
    expect(
      view.getByRole('button', { name: 'Heading: Welcome' }),
    ).toHaveAttribute('aria-pressed', 'false')
    expect(view.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(view.getByRole('button', { name: 'Redo' })).toBeEnabled()

    fireEvent.click(view.getByRole('button', { name: 'Redo' }))

    expect(
      view.getByRole('button', { name: 'Button: Click me' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(view.getByLabelText('Label')).toHaveValue('Click me')
    expect(view.getByRole('button', { name: 'Undo' })).toBeEnabled()
    expect(view.getByRole('button', { name: 'Redo' })).toBeDisabled()
  })

  it('resets undo history when the initial document is replaced', () => {
    let store: EditorStore<CanvasDocument> | undefined

    const firstDocument = createFixtureDocumentWithHeading('First document')
    const secondDocument = createFixtureDocumentWithHeading('Second document')

    const view = render(
      <EditorShell
        initialDocument={firstDocument}
        onEditorReady={(instance) => {
          store = instance.store
        }}
      />,
    )

    expect(
      view.getByText('Select a node to edit its content and styles.'),
    ).toBeInTheDocument()

    selectHeadingForEditing(store)

    fireEvent.change(view.getByLabelText('Text'), {
      target: { value: 'First document edited' },
    })

    expect(view.getByRole('button', { name: 'Undo' })).toBeEnabled()
    expect(view.getByLabelText('Text')).toHaveValue('First document edited')

    view.rerender(
      <EditorShell
        initialDocument={secondDocument}
        onEditorReady={(instance) => {
          store = instance.store
        }}
      />,
    )

    expect(view.getByLabelText('Text')).toHaveValue('Second document')
    expect(view.getByRole('button', { name: 'Undo' })).toBeDisabled()

    fireEvent.change(view.getByLabelText('Text'), {
      target: { value: 'Second document edited' },
    })

    expect(view.getByRole('button', { name: 'Undo' })).toBeEnabled()

    fireEvent.click(view.getByRole('button', { name: 'Undo' }))

    expect(view.getByLabelText('Text')).toHaveValue('Second document')
  })
})
