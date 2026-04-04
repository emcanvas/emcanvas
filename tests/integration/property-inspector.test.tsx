import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useEffect, useRef, useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

import type { CanvasDocument } from '../../src/foundation/types/canvas'
import { EditorSidebar } from '../../src/editor/shell/editor-sidebar'
import { createHistoryStore } from '../../src/editor/state/history-store'
import type { EditorBreakpoint, EditorState } from '../../src/editor/state/editor-store'

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
          id: 'heading-1',
          type: 'heading',
          props: {
            text: 'Welcome',
            level: 2,
          },
          styles: {
            desktop: {
              fontSize: '32px',
              color: '#111111',
            },
            tablet: {
              fontSize: '24px',
            },
          },
          children: [],
        },
      ],
    },
    settings: {},
  }
}

function PropertyInspectorHarness() {
  const [document, setDocument] = useState(() => createFixtureDocument())
  const [breakpoint, setBreakpoint] = useState<EditorBreakpoint>('desktop')
  const documentRef = useRef(document)
  const [history] = useState(() => createHistoryStore())

  useEffect(() => {
    documentRef.current = document
  }, [document])

  const state: EditorState = {
    selectedNodeId: 'heading-1',
    dirty: false,
    breakpoint,
    canUndo: history.canUndo(),
    canRedo: history.canRedo(),
  }

  return (
    <>
      <EditorSidebar
        document={document}
        getDocument={() => documentRef.current}
        state={state}
        onBreakpointChange={setBreakpoint}
        onDocumentChange={setDocument}
        onCommand={(command) => history.execute(command)}
      />
      <output data-testid="level-prop">{JSON.stringify(document.root.children?.[0]?.props.level)}</output>
    </>
  )
}

describe('PropertyInspector', () => {
  it('renders generated controls from widget schema and keeps styles scoped per breakpoint', () => {
    render(<PropertyInspectorHarness />)

    expect(screen.getByRole('form', { name: 'Property inspector form' })).toBeInTheDocument()
    expect(screen.getByLabelText('Text')).toHaveValue('Welcome')
    expect(screen.getByLabelText('Level')).toHaveValue(2)
    expect(screen.getByLabelText('Font size')).toHaveValue('32px')
    expect(screen.getByLabelText('Color')).toHaveValue('#111111')

    fireEvent.change(screen.getByLabelText('Text'), { target: { value: 'Updated heading' } })
    expect(screen.getByLabelText('Text')).toHaveValue('Updated heading')

    fireEvent.click(screen.getByRole('button', { name: 'Tablet' }))

    expect(screen.getByLabelText('Font size')).toHaveValue('24px')
    expect(screen.getByLabelText('Color')).toHaveValue('')

    fireEvent.change(screen.getByLabelText('Font size'), { target: { value: '20px' } })
    expect(screen.getByLabelText('Font size')).toHaveValue('20px')

    fireEvent.click(screen.getByRole('button', { name: 'Desktop' }))

    expect(screen.getByLabelText('Font size')).toHaveValue('32px')
    expect(screen.getByLabelText('Text')).toHaveValue('Updated heading')
  })

  it('does not persist empty strings into numeric props', () => {
    render(<PropertyInspectorHarness />)

    const levelInput = screen.getByLabelText('Level')

    fireEvent.change(levelInput, { target: { value: '' } })

    expect(screen.getByTestId('level-prop')).toHaveTextContent('2')
  })
})
