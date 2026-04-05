import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../../src/foundation/shared/constants'
import { getCanvasEntryState } from '../../../src/renderer/data/get-canvas-entry-state'

function getCurrentWorkingDirectory(): string {
  return (globalThis as unknown as { process: { cwd(): string } }).process.cwd()
}

function getTypeScriptDiagnostics(entryFile: string): string[] {
  const projectRootPath = getCurrentWorkingDirectory()
  const tsconfigPath = `${projectRootPath}/tsconfig.json`
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile)

  if (configFile.error) {
    return [ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n')]
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    projectRootPath,
  )
  const program = ts.createProgram({
    rootNames: [entryFile],
    options: parsedConfig.options,
  })

  return ts.getPreEmitDiagnostics(program).map((diagnostic) => {
    const location = diagnostic.file
      ? `${diagnostic.file.fileName}:${diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start ?? 0).line + 1}`
      : 'unknown'

    return `${location} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`
  })
}

describe('getCanvasEntryState', () => {
  it('returns a renderable normalized document when emcanvas is enabled', () => {
    const state = getCanvasEntryState({
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: { color: 'red' }, tablet: { width: '80%' } },
        },
        settings: {},
      },
    })

    expect(state.shouldRender).toBe(true)
    expect(state.document).toEqual({
      version: CANVAS_DOCUMENT_VERSION,
      root: {
        id: 'root',
        type: 'section',
        props: {},
        styles: { desktop: { color: 'red' }, tablet: { width: '80%' } },
        children: [],
      },
      settings: {},
    })
  })

  it('fails safe instead of rendering when the persisted document contains non-JSON props', () => {
    const state = getCanvasEntryState({
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {
            unsafe: () => 'boom',
          },
          styles: { desktop: {} },
          children: [],
        },
        settings: {},
      },
    })

    expect(state.shouldRender).toBe(false)
    expect(state.document).toBeNull()
  })

  it('does not render when the layout payload is invalid', () => {
    const state = getCanvasEntryState({
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: true,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: 'invalid',
        },
        settings: {},
      },
    })

    expect(state.shouldRender).toBe(false)
    expect(state.document).toBeNull()
  })

  it('does not render when emcanvas metadata is disabled', () => {
    const state = getCanvasEntryState({
      [EMCANVAS_ENTRY_META_KEY]: {
        enabled: false,
        version: CANVAS_DOCUMENT_VERSION,
        editorVersion: EMCANVAS_EDITOR_VERSION,
      },
      [EMCANVAS_LAYOUT_KEY]: {
        version: CANVAS_DOCUMENT_VERSION,
        root: {
          id: 'root',
          type: 'section',
          props: {},
          styles: { desktop: {} },
          children: [],
        },
        settings: {},
      },
    })

    expect(state.shouldRender).toBe(false)
    expect(state.document?.root.id).toBe('root')
  })
})

describe('getCanvasEntryState typing', () => {
  it('keeps unknown-valued entry data free of any in the focused contract fixture', () => {
    const fixturePath = `${getCurrentWorkingDirectory()}/tests/unit/renderer/fixtures/get-canvas-entry-state-no-any.fixture.ts`

    expect(getTypeScriptDiagnostics(fixturePath)).toEqual([])
  })

  it('does not cast the full entry data object to EmCanvasEntryData', () => {
    const sourcePath = `${getCurrentWorkingDirectory()}/src/renderer/data/get-canvas-entry-state.ts`
    const source = ts.sys.readFile(sourcePath)

    expect(source).toBeDefined()
    expect(source).not.toContain('as EmCanvasEntryData')
  })
})
