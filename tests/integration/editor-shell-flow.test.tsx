import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorShell } from '../../src/editor/shell/editor-shell'

describe('editor shell flow', () => {
  it('renders toolbar, canvas, sidebar, and statusbar', () => {
    render(<EditorShell />)

    expect(screen.getByLabelText('Editor toolbar')).toBeInTheDocument()
    expect(screen.getByLabelText('Canvas viewport')).toBeInTheDocument()
    expect(screen.getByLabelText('Property inspector')).toBeInTheDocument()
    expect(screen.getByLabelText('Editor statusbar')).toBeInTheDocument()
  })
})
