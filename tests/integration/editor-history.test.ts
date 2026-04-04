import { describe, expect, it } from 'vitest'

import type { CanvasDocument, CanvasNode } from '../../src/foundation/types/canvas'
import { CreateNodeCommand } from '../../src/editor/commands/create-node-command'
import { DeleteNodeCommand } from '../../src/editor/commands/delete-node-command'
import { MoveNodeCommand } from '../../src/editor/commands/move-node-command'
import { UpdateNodePropsCommand } from '../../src/editor/commands/update-props-command'
import { UpdateNodeStylesCommand } from '../../src/editor/commands/update-styles-command'
import { createHistoryStore } from '../../src/editor/state/history-store'

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

function createTextNode(): CanvasNode {
  return {
    id: 'text-1',
    type: 'text',
    props: { text: 'Body copy' },
    styles: { desktop: {} },
    children: [],
  }
}

describe('history store', () => {
  it('executes commands and can undo and redo them', () => {
    const history = createHistoryStore()
    let document = createFixtureDocument()

    expect(history.canUndo()).toBe(false)
    expect(history.canRedo()).toBe(false)

    history.execute(
      new CreateNodeCommand({
        getDocument: () => document,
        setDocument: (nextDocument) => {
          document = nextDocument
        },
        parentId: 'container-1',
        node: createTextNode(),
      }),
    )

    expect(document.root.children?.[1]?.children?.map((node) => node.id)).toEqual(['text-1'])
    expect(history.canUndo()).toBe(true)
    expect(history.canRedo()).toBe(false)

    history.undo()

    expect(document.root.children?.[1]?.children).toEqual([])
    expect(history.canUndo()).toBe(false)
    expect(history.canRedo()).toBe(true)

    history.redo()

    expect(document.root.children?.[1]?.children?.map((node) => node.id)).toEqual(['text-1'])
    expect(history.canUndo()).toBe(true)
    expect(history.canRedo()).toBe(false)
  })

  it('replays move and delete commands against the current document', () => {
    const history = createHistoryStore()
    let document = createFixtureDocument()

    const setDocument = (nextDocument: CanvasDocument) => {
      document = nextDocument
    }

    history.execute(
      new MoveNodeCommand({
        getDocument: () => document,
        setDocument,
        nodeId: 'heading-1',
        targetParentId: 'container-1',
      }),
    )

    expect(document.root.children?.map((node) => node.id)).toEqual(['container-1'])
    expect(document.root.children?.[0]?.children?.map((node) => node.id)).toEqual(['heading-1'])

    history.execute(
      new DeleteNodeCommand({
        getDocument: () => document,
        setDocument,
        nodeId: 'heading-1',
      }),
    )

    expect(document.root.children?.[0]?.children).toEqual([])

    history.undo()
    expect(document.root.children?.[0]?.children?.map((node) => node.id)).toEqual(['heading-1'])

    history.undo()
    expect(document.root.children?.map((node) => node.id)).toEqual(['heading-1', 'container-1'])

    history.redo()
    history.redo()

    expect(document.root.children?.map((node) => node.id)).toEqual(['container-1'])
    expect(document.root.children?.[0]?.children).toEqual([])
  })

  it('makes prop and style edits undoable through the history path', () => {
    const history = createHistoryStore()
    let document = createFixtureDocument()

    const setDocument = (nextDocument: CanvasDocument) => {
      document = nextDocument
    }

    history.execute(
      new UpdateNodePropsCommand({
        getDocument: () => document,
        setDocument,
        nodeId: 'heading-1',
        nextProps: { text: 'Updated heading' },
      }),
    )

    history.execute(
      new UpdateNodeStylesCommand({
        getDocument: () => document,
        setDocument,
        nodeId: 'heading-1',
        breakpoint: 'desktop',
        nextStyles: { color: '#ff0000' },
      }),
    )

    expect(document.root.children?.[0]?.props.text).toBe('Updated heading')
    expect(document.root.children?.[0]?.styles.desktop).toMatchObject({ color: '#ff0000' })

    history.undo()
    expect(document.root.children?.[0]?.styles.desktop).toEqual({})
    expect(document.root.children?.[0]?.props.text).toBe('Updated heading')

    history.undo()
    expect(document.root.children?.[0]?.props.text).toBe('Welcome')

    history.redo()
    history.redo()

    expect(document.root.children?.[0]?.props.text).toBe('Updated heading')
    expect(document.root.children?.[0]?.styles.desktop).toMatchObject({ color: '#ff0000' })
  })
})
