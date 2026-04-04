import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorShell } from '../../../src/foundation/editor/shell/editor-shell'

describe('EditorShell', () => {
  it('renders the visual editor shell', () => {
    render(<EditorShell />)

    expect(screen.getByRole('banner', { name: 'Editor toolbar' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Canvas viewport' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo', { name: 'Editor statusbar' })).toBeInTheDocument()
  })
})
