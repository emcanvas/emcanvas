import type { EmCanvasEntryData } from '../../foundation/types/entry-data'

export interface CanvasEntry {
  data: Record<string, unknown> & EmCanvasEntryData
}
