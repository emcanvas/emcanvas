import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { CanvasSurface } from '../../src/editor/canvas/canvas-surface'
import type { CanvasDocument } from '../../src/foundation/types/canvas'
import {
  createFixtureDocument,
  createFixtureHeadingNode,
} from '../fixtures/document-factory'

function createDocument(): CanvasDocument {
  const document = createFixtureDocument()

  document.root.children = [createFixtureHeadingNode('Welcome')]

  return document
}

function cloneDocument(document: CanvasDocument): CanvasDocument {
  return {
    ...document,
    root: {
      ...document.root,
      children: [...(document.root.children ?? [])],
    },
  }
}

function mockRect(
  element: Element,
  rect: Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>,
) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: rect.left,
      y: rect.top,
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      toJSON: () => rect,
    }),
  })
}

describe('CanvasSurface selection outline', () => {
  afterEach(() => {
    cleanup()
  })

  it('positions the outline over the selected canvas node', () => {
    const document = createDocument()
    const view = render(
      <CanvasSurface document={document} selectedNodeId="heading-1" />,
    )

    const surface = view.getByLabelText('Canvas surface')
    const selectedNode = view
      .getByRole('button', { name: 'Heading: Welcome' })
      .closest('[data-node-id="heading-1"]')

    expect(selectedNode).not.toBeNull()

    mockRect(surface, { top: 24, left: 16, width: 640, height: 480 })
    mockRect(selectedNode as Element, {
      top: 92,
      left: 52,
      width: 220,
      height: 48,
    })

    view.rerender(
      <CanvasSurface
        document={cloneDocument(document)}
        selectedNodeId="heading-1"
      />,
    )

    const outline = view.container.querySelector(
      '[data-layer="selection-outline"]',
    )

    expect(outline).toHaveStyle({
      top: '68px',
      left: '36px',
      width: '220px',
      height: '48px',
    })
  })

  it('hides the outline when there is no current selection', () => {
    const document = createDocument()
    const view = render(
      <CanvasSurface document={document} selectedNodeId="heading-1" />,
    )

    const surface = view.getByLabelText('Canvas surface')
    const selectedNode = view
      .getByRole('button', { name: 'Heading: Welcome' })
      .closest('[data-node-id="heading-1"]')

    expect(selectedNode).not.toBeNull()

    mockRect(surface, { top: 24, left: 16, width: 640, height: 480 })
    mockRect(selectedNode as Element, {
      top: 92,
      left: 52,
      width: 220,
      height: 48,
    })

    view.rerender(
      <CanvasSurface
        document={cloneDocument(document)}
        selectedNodeId="heading-1"
      />,
    )
    view.rerender(
      <CanvasSurface
        document={cloneDocument(document)}
        selectedNodeId={null}
      />,
    )

    const outline = view.container.querySelector(
      '[data-layer="selection-outline"]',
    )

    expect(outline).toHaveAttribute('hidden')
  })
})
