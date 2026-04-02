import type { WidgetCategory } from './categories'

export interface WidgetPropSchemaItem {
  key: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'media'
  label?: string
  min?: number
  max?: number
  options?: Array<{ label: string; value: string }>
}

export interface WidgetDefinition {
  type: string
  label: string
  category: WidgetCategory
  defaultProps: Record<string, unknown>
  propSchema: WidgetPropSchemaItem[]
  allowedChildren?: string[] | 'any' | 'none'
}
