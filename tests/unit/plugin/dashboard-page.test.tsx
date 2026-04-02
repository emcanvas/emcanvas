import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardPage } from '../../../src/plugin/pages/dashboard-page'

describe('DashboardPage', () => {
  it('mounts the foundation editor app', () => {
    render(<DashboardPage />)

    expect(screen.getByRole('heading', { name: 'EmCanvas' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Canvas viewport' })).toBeInTheDocument()
  })
})
