import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useEffect, useRef, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DropZoneLayer } from '../../src/editor/canvas/drop-zone-layer'
import { createHistoryStore } from '../../src/editor/state/history-store'
import type { CanvasDocument } from '../../src/foundation/types/canvas'

afterEach(() => {
  cleanup()
})

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
          id: 'columns-1',
          type: 'columns',
          props: { columns: 2 },
          styles: { desktop: {} },
          children: [],
        },
        {
          id: 'heading-1',
          type: 'heading',
          props: { text: 'Welcome', level: 2 },
          styles: { desktop: {} },
          children: [],
        },
        {
          id: 'container-1',
          type: 'container',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
      ],
    },
    settings: {},
  }
}

function createDataTransfer(payload: unknown) {
  return {
    dropEffect: 'move',
    effectAllowed: 'all',
    getData: vi.fn((type: string) =>
      type === 'application/emcanvas-dnd' ? JSON.stringify(payload) : '',
    ),
    setData: vi.fn(),
    clearData: vi.fn(),
  }
}

function DropZoneHarness() {
  const [document, setDocument] = useState(() => createFixtureDocument())
  const documentRef = useRef(document)
  const [history] = useState(() => createHistoryStore())

  useEffect(() => {
    documentRef.current = document
  }, [document])

  return (
    <>
      <DropZoneLayer
        getDocument={() => documentRef.current}
        targetParentId="root"
        label="Root drop zone"
        setDocument={setDocument}
        onCommand={(command) => history.execute(command)}
      />
      <DropZoneLayer
        getDocument={() => documentRef.current}
        targetParentId="columns-1"
        label="Columns drop zone"
        setDocument={setDocument}
        onCommand={(command) => history.execute(command)}
      />
      <DropZoneLayer
        getDocument={() => documentRef.current}
        targetParentId="container-1"
        label="Container drop zone"
        setDocument={setDocument}
        onCommand={(command) => history.execute(command)}
      />
      <button type="button" onClick={() => history.undo()}>
        Undo
      </button>
      <button type="button" onClick={() => history.redo()}>
        Redo
      </button>
      <output data-testid="root-children">
        {document.root.children?.map((node) => node.type).join(',')}
      </output>
      <output data-testid="container-children">
        {document.root.children?.find((node) => node.id === 'container-1')?.children
          ?.map((node) => node.id)
          .join(',') ?? ''}
      </output>
    </>
  )
}

describe('DropZoneLayer', () => {
  it('creates a new node when a valid widget payload is dropped', () => {
    render(<DropZoneHarness />)

    fireEvent.drop(screen.getByLabelText('Root drop zone'), {
      dataTransfer: createDataTransfer({ kind: 'create', nodeType: 'text' }),
    })

    expect(screen.getByTestId('root-children').textContent).toBe('columns,heading,container,text')

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(screen.getByTestId('root-children').textContent).toBe('columns,heading,container')

    fireEvent.click(screen.getByRole('button', { name: 'Redo' }))
    expect(screen.getByTestId('root-children').textContent).toBe('columns,heading,container,text')
  })

  it('ignores drops that violate document child constraints', () => {
    render(<DropZoneHarness />)

    fireEvent.drop(screen.getByLabelText('Columns drop zone'), {
      dataTransfer: createDataTransfer({ kind: 'create', nodeType: 'heading' }),
    })

    expect(screen.getByTestId('root-children').textContent).toBe('columns,heading,container')
  })

  it('moves an existing node into a valid target container', () => {
    render(<DropZoneHarness />)

    fireEvent.drop(screen.getByLabelText('Container drop zone'), {
      dataTransfer: createDataTransfer({ kind: 'move', nodeId: 'heading-1' }),
    })

    expect(screen.getByTestId('root-children').textContent).toBe('columns,container')
    expect(screen.getByTestId('container-children').textContent).toBe('heading-1')

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(screen.getByTestId('root-children').textContent).toBe('columns,heading,container')
    expect(screen.getByTestId('container-children').textContent).toBe('')
  })
})
