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

  it('creates isolated document and store instances per mount', () => {
    const instances: Array<{ document: CanvasDocument; store: EditorStore<CanvasDocument> }> = []

    render(
      <>
        <EditorShell onEditorReady={(instance) => instances.push(instance)} />
        <EditorShell onEditorReady={(instance) => instances.push(instance)} />
      </>
    )

    expect(instances).toHaveLength(2)
    expect(instances[0]?.document).not.toBe(instances[1]?.document)
    expect(instances[0]?.store).not.toBe(instances[1]?.store)

    instances[0]?.store.markDirty()

    expect(instances[0]?.store.getState().dirty).toBe(true)
    expect(instances[1]?.store.getState().dirty).toBe(false)

    const firstInstance = instances[0]
    const secondInstance = instances[1]

    if (!firstInstance || !secondInstance) {
      throw new Error('Expected both editor instances to be ready')
    }

    const firstChildren = firstInstance.document.root.children

    if (!firstChildren) {
      throw new Error('Expected first editor root to expose children')
    }

    firstChildren.push(secondInstance.document.root)

    expect(firstChildren).toHaveLength(1)
    expect(secondInstance.document.root.children).toHaveLength(0)
  })

  it('rerenders shell state when the local editor store changes', () => {
    let store: EditorStore<CanvasDocument> | undefined
    let document: CanvasDocument | undefined

    const view = render(
      <EditorShell
        onEditorReady={(instance) => {
          document = instance.document
          store = instance.store
        }}
      />
    )

    const shell = within(view.container)

    expect(shell.getByText('Breakpoint: desktop')).toBeInTheDocument()
    expect(shell.getByText('All changes saved')).toBeInTheDocument()
    expect(shell.getByRole('button', { name: 'Undo' })).toBeDisabled()

    act(() => {
      store?.markDirty()
      store?.setBreakpoint('mobile')
      if (document) {
        store?.pushHistory(document)
        store?.pushHistory({
          ...document,
          settings: { ...document.settings, mode: 'preview' },
        })
      }
    })

    expect(shell.getByText('Breakpoint: mobile')).toBeInTheDocument()
    expect(shell.getByText('Unsaved changes')).toBeInTheDocument()
    expect(shell.getByRole('button', { name: 'Undo' })).toBeEnabled()
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
