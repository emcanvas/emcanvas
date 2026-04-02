function toCssPropertyName(property: string): string {
  return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

function isSafeCssPropertyName(property: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(property)
}

function sanitizeCssValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9#%(),.\-\s/]/g, '_').trim()
}

export function buildInlineStyle(styles: Record<string, unknown>): string {
  return Object.entries(styles)
    .map(([property, value]) => [toCssPropertyName(property), value] as const)
    .filter(([property, value]) => typeof value === 'string' && value.length > 0 && isSafeCssPropertyName(property))
    .map(([property, value]) => `${property}:${sanitizeCssValue(value)}`)
    .filter((declaration) => !declaration.endsWith(':'))
    .join(';')
}
