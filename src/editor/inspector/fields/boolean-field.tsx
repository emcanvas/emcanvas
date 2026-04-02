export interface BooleanFieldProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export function BooleanField({ label, value, onChange }: BooleanFieldProps) {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  )
}
