import { shouldRenderEmCanvas } from '../../integration/page/should-render-emcanvas'

export function getPageMetadata(ctx: { entry: { data: Record<string, unknown> } }) {
  return {
    editor: shouldRenderEmCanvas(ctx.entry.data) ? 'emcanvas' : 'default',
    takeover: shouldRenderEmCanvas(ctx.entry.data),
  }
}
