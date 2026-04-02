import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ViewportPanel } from '../../../src/foundation/editor/shell/viewport-panel'

describe('ViewportPanel', () => {
  it('renders a labeled canvas viewport panel', () => {
    render(<ViewportPanel />)

    expect(screen.getByRole('region', { name: 'Canvas viewport' })).toBeInTheDocument()
    expect(screen.getByText('Visual editor viewport')).toBeInTheDocument()
  })
})
