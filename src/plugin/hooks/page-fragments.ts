import {
  getPageFragments,
  type PageFragment,
} from '../../integration/hooks/page-fragments'

export function pageFragments(ctx: { entry: { data: Record<string, unknown> } }): PageFragment[] {
  return getPageFragments(ctx.entry.data)
}
