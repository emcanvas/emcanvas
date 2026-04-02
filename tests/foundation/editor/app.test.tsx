import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EditorApp } from '../../../src/foundation/editor/app'
import * as editorSessionModule from '../../../src/foundation/editor/state/editor-session'

describe('EditorApp', () => {
  it('creates the default editor session once per mount', () => {
    const createEditorSessionSpy = vi.spyOn(editorSessionModule, 'createEditorSession')

    const { rerender } = render(<EditorApp />)

    rerender(<EditorApp />)

    expect(createEditorSessionSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('heading', { name: 'EmCanvas' })).toBeInTheDocument()
  })
})
