import { act, cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EditorShell } from '@emcanvas/editor/shell/editor-shell'
import type { CanvasDocument } from '@emcanvas/foundation/types/canvas'
import type { EditorStore } from '@emcanvas/editor/state/editor-store'
import { createFixtureDocument, createFixtureHeadingNode } from '../fixtures/document-factory'

function createFixtureDocumentWithHeading(text: string): CanvasDocument {
  const document = createFixtureDocument()

  document.root.children = [createFixtureHeadingNode(text)]

  return document
}

afterEach(() => {
  cleanup()
})

describe('editor shell flow', () => {
  it('renders toolbar, canvas, sidebar, and statusbar', () => {
    const view = render(<EditorShell />)

    expect(view.getByLabelText('Editor toolbar')).toBeInTheDocument()
    expect(view.getByLabelText('Canvas viewport')).toBeInTheDocument()
    expect(view.getByLabelText('Property inspector')).toBeInTheDocument()
    expect(view.getByLabelText('Editor statusbar')).toBeInTheDocument()
  })

  it('keeps each mounted shell isolated through visible state changes', () => {
    const stores: EditorStore<CanvasDocument>[] = []
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
      </>
    )

    act(() => {
      stores[0]?.selectNode('heading-1')
      stores[1]?.selectNode('heading-1')
    })

    const firstShell = within(view.getByTestId('first-shell'))
    const secondShell = within(view.getByTestId('second-shell'))

    expect(firstShell.getByLabelText('Text')).toHaveValue('First heading')
    expect(secondShell.getByLabelText('Text')).toHaveValue('Second heading')

    fireEvent.change(secondShell.getByLabelText('Text'), { target: { value: 'Second heading updated' } })

    expect(firstShell.getByLabelText('Text')).toHaveValue('First heading')
    expect(firstShell.getByText('All changes saved')).toBeInTheDocument()
    expect(firstShell.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(secondShell.getByLabelText('Text')).toHaveValue('Second heading updated')
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
      />
    )

    const shell = within(view.container)

    expect(shell.getByText('Breakpoint: desktop')).toBeInTheDocument()
    expect(shell.getByText('All changes saved')).toBeInTheDocument()
    expect(shell.getByRole('button', { name: 'Undo' })).toBeDisabled()

    act(() => {
      store?.selectNode('heading-1')
    })

    fireEvent.click(view.getByRole('button', { name: 'Mobile' }))
    fireEvent.change(view.getByLabelText('Text'), { target: { value: 'Updated heading' } })

    expect(shell.getByText('Breakpoint: mobile')).toBeInTheDocument()
    expect(shell.getByText('Unsaved changes')).toBeInTheDocument()
    expect(shell.getByRole('button', { name: 'Undo' })).toBeEnabled()
    expect(view.getByLabelText('Text')).toHaveValue('Updated heading')
  })

  it('routes live sidebar prop and style edits through undoable history', () => {
    let store: EditorStore<CanvasDocument> | undefined

    const view = render(
      <EditorShell
        initialDocument={createFixtureDocumentWithHeading('Welcome')}
        onEditorReady={(instance) => {
          store = instance.store
        }}
      />
    )

    act(() => {
      store?.selectNode('heading-1')
    })

    fireEvent.change(view.getByLabelText('Text'), { target: { value: 'Updated heading' } })
    fireEvent.change(view.getByLabelText('Color'), { target: { value: '#ff0000' } })

    expect(view.getByLabelText('Text')).toHaveValue('Updated heading')
    expect(view.getByLabelText('Color')).toHaveValue('#ff0000')

    fireEvent.click(view.getByRole('button', { name: 'Undo' }))

    expect(view.getByLabelText('Text')).toHaveValue('Updated heading')
    expect(view.getByLabelText('Color')).toHaveValue('')

    fireEvent.click(view.getByRole('button', { name: 'Undo' }))

    expect(view.getByLabelText('Text')).toHaveValue('Welcome')

    fireEvent.click(view.getByRole('button', { name: 'Redo' }))
    fireEvent.click(view.getByRole('button', { name: 'Redo' }))

    expect(view.getByLabelText('Text')).toHaveValue('Updated heading')
    expect(view.getByLabelText('Color')).toHaveValue('#ff0000')
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
      />
    )

    act(() => {
      store?.selectNode('heading-1')
    })

    fireEvent.change(view.getByLabelText('Text'), { target: { value: 'First document edited' } })

    expect(view.getByRole('button', { name: 'Undo' })).toBeEnabled()
    expect(view.getByLabelText('Text')).toHaveValue('First document edited')

    view.rerender(
      <EditorShell
        initialDocument={secondDocument}
        onEditorReady={(instance) => {
          store = instance.store
        }}
      />
    )

    expect(view.getByLabelText('Text')).toHaveValue('Second document')
    expect(view.getByRole('button', { name: 'Undo' })).toBeDisabled()

    fireEvent.change(view.getByLabelText('Text'), { target: { value: 'Second document edited' } })

    expect(view.getByRole('button', { name: 'Undo' })).toBeEnabled()

    fireEvent.click(view.getByRole('button', { name: 'Undo' }))

    expect(view.getByLabelText('Text')).toHaveValue('Second document')
  })
})
