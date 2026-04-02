function toCssPropertyName(property: string): string {
  return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

export function buildInlineStyle(styles: Record<string, unknown>): string {
  return Object.entries(styles)
    .filter(([, value]) => typeof value === 'string' && value.length > 0)
    .map(([property, value]) => `${toCssPropertyName(property)}:${value}`)
    .join(';')
}
