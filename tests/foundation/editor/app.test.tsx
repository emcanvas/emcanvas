import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorApp } from '../../../src/foundation/editor/app'

describe('EditorApp', () => {
  it('delegates to the real editor shell path', () => {
    render(<EditorApp />)

    expect(screen.getByRole('banner', { name: 'Editor toolbar' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo', { name: 'Editor statusbar' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'EmCanvas' })).not.toBeInTheDocument()
  })
})
