import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('plugin admin entry import boundary', () => {
  it('does not evaluate heavy page modules during import-time', async () => {
    let dashboardModuleLoaded = false
    let editorModuleLoaded = false

    vi.resetModules()
    vi.doMock('../../src/plugin/pages/dashboard-page.js', () => {
      dashboardModuleLoaded = true

      return {
        default: () => null,
        DashboardPage: () => null,
      }
    })
    vi.doMock('../../src/plugin/pages/editor-page.js', () => {
      editorModuleLoaded = true

      return {
        default: () => null,
        EditorPage: () => null,
      }
    })

    const admin = await import('../../src/plugin/admin-entry')

    expect(admin.pages).toMatchObject({
      '/dashboard': expect.any(Function),
      '/editor': expect.any(Function),
    })
    expect(dashboardModuleLoaded).toBe(false)
    expect(editorModuleLoaded).toBe(false)

    vi.doUnmock('../../src/plugin/pages/dashboard-page.js')
    vi.doUnmock('../../src/plugin/pages/editor-page.js')
    vi.resetModules()
  })

  it('loads the editor page only when the host renders it', async () => {
    vi.resetModules()

    const admin = await import('../../src/plugin/admin-entry')
    const EditorPage = admin.pages['/editor']

    render(<EditorPage entry={{ data: {} }} />)

    expect(
      await screen.findByRole('heading', { name: 'EmCanvas editor' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
  })

  it('exposes slash-prefixed page keys for EmDash route lookup', async () => {
    const admin = await import('../../src/plugin/admin-entry')

    expect(admin.pages['/editor']).toBeTypeOf('function')
    expect(admin.pages['/dashboard']).toBeTypeOf('function')
    expect(admin.pages['editor']).toBeUndefined()
    expect(admin.pages['dashboard']).toBeUndefined()
  })
})
