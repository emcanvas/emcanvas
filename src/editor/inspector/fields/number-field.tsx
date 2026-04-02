export interface NumberFieldProps {
  label: string
  value: number | ''
  min?: number
  max?: number
  onChange: (value: number | '') => void
}

export function NumberField({ label, value, min, max, onChange }: NumberFieldProps) {
  return (
    <label>
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value
          onChange(nextValue === '' ? '' : Number(nextValue))
        }}
      />
    </label>
  )
}
