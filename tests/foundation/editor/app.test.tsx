import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorApp } from '../../../src/foundation/editor/app'

describe('EditorApp', () => {
  it('renders the visible editor shell controls and status', () => {
    render(<EditorApp />)

    expect(screen.getByRole('banner', { name: 'Editor toolbar' })).toBeInTheDocument()
    expect(screen.getByText('EmCanvas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Canvas viewport' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo', { name: 'Editor statusbar' })).toBeInTheDocument()
    expect(screen.getByText('All changes saved')).toBeInTheDocument()
  })
})
