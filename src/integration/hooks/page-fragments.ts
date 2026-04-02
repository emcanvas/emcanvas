import { shouldRenderEmCanvas } from '../page/should-render-emcanvas'

export interface PageFragment {
  slot: 'head'
  html: string
}

const PAGE_FRAGMENT_STYLES = '<style data-emcanvas-page-fragments>[data-emcanvas-root]{width:100%;}</style>'

export function getPageFragments(entryData: Record<string, unknown>): PageFragment[] {
  if (!shouldRenderEmCanvas(entryData)) {
    return []
  }

  return [
    {
      slot: 'head',
      html: PAGE_FRAGMENT_STYLES,
    },
  ]
}
