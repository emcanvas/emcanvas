import type { NormalizedCanvasDocument } from '../../renderer/types/renderer'
import { getCanvasEntryState } from '../../renderer/data/get-canvas-entry-state'
import { buildRendererStylesheet } from '../../renderer/styles/build-renderer-stylesheet'

export interface PageFragment {
  slot: 'head'
  html: string
}

function buildPageFragmentStyles(document: NormalizedCanvasDocument): string {
  const stylesheet = buildRendererStylesheet(document.root)

  if (!stylesheet) {
    return ''
  }

  return `<style data-emcanvas-page-fragments>${stylesheet}</style>`
}

export function getPageFragments(
  entryData: Record<string, unknown>,
  document?: NormalizedCanvasDocument,
): PageFragment[] {
  const resolvedDocument = document ?? getCanvasEntryState(entryData).document

  if (resolvedDocument === null) {
    return []
  }

  const html = buildPageFragmentStyles(resolvedDocument)

  if (!html) {
    return []
  }

  return [
    {
      slot: 'head',
      html,
    },
  ]
}
