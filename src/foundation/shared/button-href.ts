const SAFE_BUTTON_HREF_FALLBACK = '#'

export function normalizeButtonHref(value: unknown): string {
  if (typeof value !== 'string') {
    return SAFE_BUTTON_HREF_FALLBACK
  }

  const href = value.trim()

  if (href.length === 0 || href.startsWith('//')) {
    return SAFE_BUTTON_HREF_FALLBACK
  }

  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
    return href
  }

  const lowerHref = href.toLowerCase()

  if (
    lowerHref.startsWith('http://') ||
    lowerHref.startsWith('https://') ||
    lowerHref.startsWith('mailto:') ||
    lowerHref.startsWith('tel:')
  ) {
    return href
  }

  return SAFE_BUTTON_HREF_FALLBACK
}
