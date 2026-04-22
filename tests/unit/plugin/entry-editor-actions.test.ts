// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { getEntryEditorActions } from '../../../src/plugin/hooks/entry-editor-actions'

describe('entry editor actions', () => {
  it('builds an EmDash admin deep-link with entry id as the primary identifier', () => {
    const actions = getEntryEditorActions({
      entry: {
        data: {
          id: 'entry-123',
          slug: 'home',
          title: 'Homepage',
        },
      },
    })

    expect(actions).toEqual([
      {
        id: 'enable-emcanvas',
        label: 'Enable EmCanvas for this entry',
        run: expect.any(Function),
      },
      {
        id: 'open-emcanvas-editor',
        label: 'Edit with EmCanvas',
        href: '/_emdash/admin/plugins/emcanvas/editor?id=entry-123&slug=home&title=Homepage',
      },
    ])
  })

  it('falls back to slug and title when the entry id is unavailable', () => {
    const actions = getEntryEditorActions({
      entry: {
        data: {
          slug: 'home',
          title: 'Homepage',
        },
      },
    })

    expect(actions).toEqual([
      {
        id: 'enable-emcanvas',
        label: 'Enable EmCanvas for this entry',
        run: expect.any(Function),
      },
      {
        id: 'open-emcanvas-editor',
        label: 'Edit with EmCanvas',
        href: '/_emdash/admin/plugins/emcanvas/editor?slug=home&title=Homepage',
      },
    ])
  })

  it('keeps only the editor deep-link when takeover is already enabled', () => {
    const actions = getEntryEditorActions({
      entry: {
        data: {
          id: 'entry-123',
          slug: 'home',
          _emcanvas: {
            enabled: true,
            version: 1,
            editorVersion: '0.1.0',
          },
          canvasLayout: {
            version: 1,
            root: {
              id: 'root',
              type: 'section',
              props: {},
              styles: { desktop: {} },
              children: [],
            },
            settings: {},
          },
        },
      },
    })

    expect(actions).toEqual([
      {
        id: 'open-emcanvas-editor',
        label: 'Edit with EmCanvas',
        href: '/_emdash/admin/plugins/emcanvas/editor?id=entry-123&slug=home',
      },
    ])
  })
})
