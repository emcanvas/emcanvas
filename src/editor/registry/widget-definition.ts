import type { WidgetCategory } from './categories'

export interface WidgetDefinition {
  type: string
  label: string
  category: WidgetCategory
  defaultProps: Record<string, unknown>
  propSchema: Array<Record<string, unknown>>
  allowedChildren?: string[] | 'any' | 'none'
}
