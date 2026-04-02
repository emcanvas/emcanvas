export interface MediaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function MediaField({ label, value, onChange }: MediaFieldProps) {
  return (
    <label>
      <span>{label}</span>
      <input type="url" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}
