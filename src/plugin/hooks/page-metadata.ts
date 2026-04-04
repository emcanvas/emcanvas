import { shouldRenderEmCanvas } from '../../integration/page/should-render-emcanvas'

export function getPageMetadata(ctx: { entry: { data: Record<string, unknown> } }): {
  editor: 'default' | 'emcanvas'
  takeover: boolean
} {
  const takeover = shouldRenderEmCanvas(ctx.entry.data)

  return {
    editor: takeover ? 'emcanvas' : 'default',
    takeover,
  }
}
