import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import EmCanvasRenderer from '../../renderer/astro/EmCanvasRenderer.astro'
import { getCanvasEntryState } from '../../renderer/data/get-canvas-entry-state'
import { getPageFragments } from '../hooks/page-fragments'

export async function renderEntryPage(data: Record<string, unknown>) {
  const state = getCanvasEntryState(data)

  if (!state.shouldRender || state.document === null) {
    return null
  }

  const container = await AstroContainer.create()
  const html = await container.renderToString(EmCanvasRenderer, {
    props: {
      document: state.document,
    },
  })

  return `${getPageFragments(data, state.document)
    .map((fragment) => fragment.html)
    .join('')}${html}`
}
