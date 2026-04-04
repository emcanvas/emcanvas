import { getCanvasEntryState } from '../../../../src/renderer/data/get-canvas-entry-state'

type IsAny<T> = 0 extends 1 & T ? true : false
type AssertFalse<T extends false> = T

type EntryDataValue = Parameters<typeof getCanvasEntryState>[0][string]

const usesAny: AssertFalse<IsAny<EntryDataValue>> = false
const state = getCanvasEntryState({ _emcanvas: { enabled: false } } as Record<string, unknown>)

void usesAny
void state
