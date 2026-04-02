import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

import type { CanvasDocument } from '../../src/foundation/types/canvas'
import { PropertyInspector } from '../../src/editor/inspector/property-inspector'
import { updateNodeProps } from '../../src/editor/commands/update-props-command'
import { updateNodeStyles } from '../../src/editor/commands/update-styles-command'
import type { EditorBreakpoint } from '../../src/editor/state/editor-store'

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
  const node = document.root.children?.[0] ?? null

  if (!node) {
    throw new Error('Fixture node missing')
  }

  return (
    <>
      <PropertyInspector
        breakpoint={breakpoint}
        node={node}
        onBreakpointChange={setBreakpoint}
        onUpdateProps={(nextProps) => {
          setDocument((currentDocument) => updateNodeProps(currentDocument, node.id, nextProps))
        }}
        onUpdateStyles={(nextStyles) => {
          setDocument((currentDocument) =>
            updateNodeStyles(currentDocument, node.id, breakpoint, nextStyles),
          )
        }}
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
