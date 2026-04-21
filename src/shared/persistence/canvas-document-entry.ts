import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import { isEmCanvasEntryMeta } from '../../foundation/model/guards'
import {
  CANVAS_DOCUMENT_VERSION,
  EMCANVAS_EDITOR_VERSION,
  EMCANVAS_ENTRY_META_KEY,
  EMCANVAS_LAYOUT_KEY,
} from '../../foundation/shared/constants'
import type {
  EmCanvasEntryData,
  EmCanvasEntryMeta,
} from '../../foundation/types/entry-data'
import type { CanvasDocument } from '../../foundation/types/canvas'
import { validateCanvasDocument } from '../validation/canvas-document'
import {
  getDefaultTakeoverMeta,
  validateTakeoverState,
} from '../validation/takeover-state'

export interface CanvasDocumentEntryState {
  canvasLayout: CanvasDocument
  _emcanvas: EmCanvasEntryMeta
}

export type SerializedCanvasEntryData = Record<string, unknown> &
  Required<EmCanvasEntryData>

export interface SerializeCanvasDocumentToEntryDataArgs {
  entryData: Record<string, unknown>
  canvasLayout: unknown
  _emcanvas?: EmCanvasEntryMeta
}

export function getDefaultCanvasDocumentState(): CanvasDocumentEntryState {
  return {
    canvasLayout: createDefaultCanvasDocument(),
    _emcanvas: getDefaultTakeoverMeta(),
  }
}

export function loadCanvasDocumentState(
  entryData: Record<string, unknown>,
): CanvasDocumentEntryState {
  const fallbackState = getDefaultCanvasDocumentState()
  const layoutValidation = validateCanvasDocument(
    entryData[EMCANVAS_LAYOUT_KEY],
  )
  const takeoverState = validateTakeoverState(entryData)

  return {
    canvasLayout: layoutValidation.document ?? fallbackState.canvasLayout,
    _emcanvas:
      takeoverState.enabled === true &&
      isEmCanvasEntryMeta(entryData[EMCANVAS_ENTRY_META_KEY])
        ? entryData[EMCANVAS_ENTRY_META_KEY]
        : fallbackState._emcanvas,
  }
}

export function serializeCanvasDocumentToEntryData({
  entryData,
  canvasLayout,
  _emcanvas = getEnabledTakeoverMeta(),
}: SerializeCanvasDocumentToEntryDataArgs): SerializedCanvasEntryData {
  const layoutValidation = validateCanvasDocument(canvasLayout)

  if (!layoutValidation.valid || layoutValidation.document === null) {
    throw new Error('Invalid canvas payload')
  }

  if (!isEmCanvasEntryMeta(_emcanvas)) {
    throw new Error('Invalid canvas payload')
  }

  return {
    ...entryData,
    [EMCANVAS_ENTRY_META_KEY]: _emcanvas,
    [EMCANVAS_LAYOUT_KEY]: layoutValidation.document,
  }
}

function getEnabledTakeoverMeta(): EmCanvasEntryMeta {
  return {
    enabled: true,
    version: CANVAS_DOCUMENT_VERSION,
    editorVersion: EMCANVAS_EDITOR_VERSION,
  }
}
