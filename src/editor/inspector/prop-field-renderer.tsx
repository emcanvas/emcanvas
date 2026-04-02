import type { WidgetPropSchemaItem } from '../registry/widget-definition'
import { BooleanField } from './fields/boolean-field'
import { MediaField } from './fields/media-field'
import { NumberField } from './fields/number-field'
import { SelectField } from './fields/select-field'
import { TextField } from './fields/text-field'

export interface PropFieldRendererProps {
  field: WidgetPropSchemaItem
  value: unknown
  onChange: (value: unknown) => void
}

function toLabel(key: string) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase())
}

export function PropFieldRenderer({ field, value, onChange }: PropFieldRendererProps) {
  const label = field.label ?? toLabel(field.key)

  switch (field.type) {
    case 'number':
      return (
        <NumberField
          label={label}
          min={field.min}
          max={field.max}
          value={typeof value === 'number' ? value : ''}
          onChange={onChange}
        />
      )
    case 'boolean':
      return <BooleanField label={label} value={value === true} onChange={onChange} />
    case 'select':
      return (
        <SelectField
          label={label}
          value={typeof value === 'string' ? value : ''}
          options={field.options ?? []}
          onChange={onChange}
        />
      )
    case 'media':
      return <MediaField label={label} value={typeof value === 'string' ? value : ''} onChange={onChange} />
    case 'string':
    default:
      return <TextField label={label} value={typeof value === 'string' ? value : ''} onChange={onChange} />
  }
}
