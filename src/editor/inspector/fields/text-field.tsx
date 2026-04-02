export interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function TextField({ label, value, onChange }: TextFieldProps) {
  return (
    <label>
      <span>{label}</span>
      <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}
