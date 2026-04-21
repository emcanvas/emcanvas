import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EditorSidebar } from '../../src/editor/shell/editor-sidebar'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import type { EditorState } from '../../src/editor/state/editor-store'

function createFixtureDocument(): CanvasDocument {
  return {
    version: 1,
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [
        {
          id: 'heading-1',
          type: 'heading',
          props: {
            text: 'Welcome',
            level: 2,
          },
          styles: { desktop: {} },
          children: [],
        },
      ],
    },
    settings: {},
  }
}

function createColumnsFixtureDocument(): CanvasDocument {
  return {
    version: 1,
    root: {
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [
        {
          id: 'columns-1',
          type: 'columns',
          props: { columns: 2 },
          styles: { desktop: {} },
          children: [],
        },
      ],
    },
    settings: {},
  }
}

function createState(selectedNodeId: string | null): EditorState {
  return {
    selectedNodeId,
    dirty: false,
    breakpoint: 'desktop',
    canUndo: false,
    canRedo: false,
  }
}

afterEach(() => {
  cleanup()
})

describe('EditorSidebar', () => {
  it('keeps an empty inspector state when nothing is selected', () => {
    const onDocumentChange = vi.fn()

    render(
      <EditorSidebar
        document={createFixtureDocument()}
        state={createState(null)}
        onBreakpointChange={() => undefined}
        onDocumentChange={onDocumentChange}
      />,
    )

    expect(
      screen.getByText('Select a node to edit its content and styles.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Section' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Desktop' }),
    ).not.toBeInTheDocument()
  })

  it('still allows editing the root node when it is explicitly selected', () => {
    const onDocumentChange = vi.fn()

    render(
      <EditorSidebar
        document={createFixtureDocument()}
        state={createState('root')}
        onBreakpointChange={() => undefined}
        onDocumentChange={onDocumentChange}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Section' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Padding'), {
      target: { value: '24px' },
    })

    expect(onDocumentChange).toHaveBeenCalledOnce()
  })

  it('shows columns quick add when existing content has no selection', () => {
    render(
      <EditorSidebar
        document={createFixtureDocument()}
        state={createState(null)}
        onBreakpointChange={() => undefined}
        onDocumentChange={() => undefined}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Add columns to page' }),
    ).toBeInTheDocument()
  })

  it('shows a focused container insertion action for columns selections', () => {
    render(
      <EditorSidebar
        document={createColumnsFixtureDocument()}
        state={createState('columns-1')}
        onBreakpointChange={() => undefined}
        onDocumentChange={() => undefined}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Add container inside' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add heading below' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add columns below' }),
    ).toBeInTheDocument()
  })
})
