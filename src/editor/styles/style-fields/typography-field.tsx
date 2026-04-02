import { SelectField } from '../../inspector/fields/select-field'
import { TextField } from '../../inspector/fields/text-field'

export interface TypographyFieldProps {
  styles: Record<string, unknown>
  onChange: (patch: Record<string, unknown>) => void
}

export function TypographyField({ styles, onChange }: TypographyFieldProps) {
  return (
    <fieldset>
      <legend>Typography</legend>
      <TextField
        label="Font weight"
        value={typeof styles.fontWeight === 'string' ? styles.fontWeight : ''}
        onChange={(value) => onChange({ fontWeight: value })}
      />
      <SelectField
        label="Text align"
        value={typeof styles.textAlign === 'string' ? styles.textAlign : 'left'}
        options={[
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ]}
        onChange={(value) => onChange({ textAlign: value })}
      />
    </fieldset>
  )
}
