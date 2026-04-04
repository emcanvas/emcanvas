import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CanvasEditorPage } from '@emcanvas/admin'

describe('plugin editor page', () => {
  it('mounts the real canvas editor page for the host', () => {
    render(<CanvasEditorPage entry={{ data: {} }} />)

    expect(screen.getByRole('heading', { name: 'EmCanvas editor' })).toBeInTheDocument()
    expect(screen.getByText(/takeover/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
  })
})
