import { TextField } from '../../inspector/fields/text-field'

export interface SizeFieldProps {
  styles: Record<string, unknown>
  onChange: (patch: Record<string, unknown>) => void
}

export function SizeField({ styles, onChange }: SizeFieldProps) {
  return (
    <fieldset>
      <legend>Size</legend>
      <TextField
        label="Width"
        value={typeof styles.width === 'string' ? styles.width : ''}
        onChange={(value) => onChange({ width: value })}
      />
      <TextField
        label="Font size"
        value={typeof styles.fontSize === 'string' ? styles.fontSize : ''}
        onChange={(value) => onChange({ fontSize: value })}
      />
    </fieldset>
  )
}
