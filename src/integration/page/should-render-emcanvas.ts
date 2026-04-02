import { EMCANVAS_ENTRY_META_KEY } from '../../foundation/shared/constants'
import type { EmCanvasEntryData } from '../../foundation/types/entry-data'

export function shouldRenderEmCanvas(data: Record<string, unknown>) {
  return Boolean((data as EmCanvasEntryData)[EMCANVAS_ENTRY_META_KEY]?.enabled)
}
