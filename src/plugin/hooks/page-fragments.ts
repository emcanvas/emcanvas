import { getPageFragments } from '../../integration/hooks/page-fragments'

export function pageFragments(ctx: { entry: { data: Record<string, unknown> } }) {
  return getPageFragments(ctx.entry.data)
}
