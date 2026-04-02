import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DashboardPage } from '../../../src/plugin/pages/dashboard-page'
import * as editorSessionModule from '../../../src/foundation/editor/state/editor-session'

describe('DashboardPage', () => {
  it('mounts the foundation editor app', () => {
    render(<DashboardPage />)

    expect(screen.getByRole('heading', { name: 'EmCanvas' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Canvas viewport' })).toBeInTheDocument()
  })

  it('does not recreate the editor session on rerender', () => {
    const createEditorSessionSpy = vi.spyOn(editorSessionModule, 'createEditorSession')

    const { rerender } = render(<DashboardPage />)

    rerender(<DashboardPage />)

    expect(createEditorSessionSpy).toHaveBeenCalledTimes(1)
  })
})
