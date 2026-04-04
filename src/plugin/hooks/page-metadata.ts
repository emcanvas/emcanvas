import { shouldRenderEmCanvas } from '../../integration/page/should-render-emcanvas'

export function getPageMetadata(ctx: { entry: { data: Record<string, unknown> } }) {
  const takeover = shouldRenderEmCanvas(ctx.entry.data)

  return {
    editor: takeover ? 'emcanvas' : 'default',
    takeover,
  }
}
