import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorShell } from '../../../src/foundation/editor/shell/editor-shell'

describe('EditorShell', () => {
  it('renders the visual editor shell', () => {
    render(<EditorShell title="EmCanvas" />)

    expect(screen.getByRole('heading', { name: 'EmCanvas' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Canvas viewport' })).toBeInTheDocument()
  })
})
