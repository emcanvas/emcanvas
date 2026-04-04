import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DashboardPage } from '../../../src/plugin/pages/dashboard-page'
import * as editorSessionModule from '../../../src/foundation/editor/state/editor-session'

describe('DashboardPage', () => {
  it('uses the real editor shell path rather than the foundation stub shell', () => {
    render(<DashboardPage />)

    expect(screen.getByRole('banner', { name: 'Editor toolbar' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo', { name: 'Editor statusbar' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Canvas viewport' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'EmCanvas' })).not.toBeInTheDocument()
  })

  it('does not create a separate foundation editor session', () => {
    const createEditorSessionSpy = vi.spyOn(editorSessionModule, 'createEditorSession')

    render(<DashboardPage />)

    expect(createEditorSessionSpy).not.toHaveBeenCalled()
  })
})
