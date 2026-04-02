export function getPreviewLink(ctx: {
  entry: { data: Record<string, unknown> }
  origin?: string
}) {
  const slug = typeof ctx.entry.data.slug === 'string' ? ctx.entry.data.slug : ''
  const origin = ctx.origin ?? ''
  const search = new URLSearchParams({
    slug,
    source: 'emcanvas',
  })

  return `${origin}/preview?${search.toString()}`
}
