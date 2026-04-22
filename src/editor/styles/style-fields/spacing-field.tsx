import { TextField } from '../../inspector/fields/text-field'

export interface SpacingFieldProps {
  styles: Record<string, unknown>
  onChange: (patch: Record<string, unknown>) => void
}

export function SpacingField({ styles, onChange }: SpacingFieldProps) {
  return (
    <fieldset>
      <legend>Spacing</legend>
      <TextField
        label="Gap"
        value={typeof styles.gap === 'string' ? styles.gap : ''}
        onChange={(value) => onChange({ gap: value })}
      />
      <TextField
        label="Padding"
        value={typeof styles.padding === 'string' ? styles.padding : ''}
        onChange={(value) => onChange({ padding: value })}
      />
      <TextField
        label="Margin"
        value={typeof styles.margin === 'string' ? styles.margin : ''}
        onChange={(value) => onChange({ margin: value })}
      />
    </fieldset>
  )
}
