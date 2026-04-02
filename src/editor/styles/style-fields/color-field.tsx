import { TextField } from '../../inspector/fields/text-field'

export interface ColorFieldProps {
  styles: Record<string, unknown>
  onChange: (patch: Record<string, unknown>) => void
}

export function ColorField({ styles, onChange }: ColorFieldProps) {
  return (
    <fieldset>
      <legend>Color</legend>
      <TextField
        label="Color"
        value={typeof styles.color === 'string' ? styles.color : ''}
        onChange={(value) => onChange({ color: value })}
      />
      <TextField
        label="Background color"
        value={typeof styles.backgroundColor === 'string' ? styles.backgroundColor : ''}
        onChange={(value) => onChange({ backgroundColor: value })}
      />
    </fieldset>
  )
}
