import { act, cleanup, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EditorShell } from '../../src/editor/shell/editor-shell'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import type { EditorStore } from '../../src/editor/state/editor-store'

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
    expect(instances[0].document).not.toBe(instances[1].document)
    expect(instances[0].store).not.toBe(instances[1].store)

    instances[0].store.markDirty()

    expect(instances[0].store.getState().dirty).toBe(true)
    expect(instances[1].store.getState().dirty).toBe(false)

    instances[0].document.root.children.push(instances[1].document.root)

    expect(instances[0].document.root.children).toHaveLength(1)
    expect(instances[1].document.root.children).toHaveLength(0)
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
})
