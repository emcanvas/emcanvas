import { getCanvasEntryState } from '../../renderer/data/get-canvas-entry-state'

export function shouldRenderEmCanvas(data: Record<string, unknown>) {
  return getCanvasEntryState(data).shouldRender
}
