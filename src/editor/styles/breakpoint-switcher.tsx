import type { EditorBreakpoint } from '../state/editor-store'

const BREAKPOINTS: EditorBreakpoint[] = ['desktop', 'tablet', 'mobile']

export interface BreakpointSwitcherProps {
  breakpoint: EditorBreakpoint
  onChange: (breakpoint: EditorBreakpoint) => void
}

export function BreakpointSwitcher({
  breakpoint,
  onChange,
}: BreakpointSwitcherProps) {
  return (
    <div aria-label="Breakpoint switcher" className="emc-breakpoint-switcher">
      {BREAKPOINTS.map((option) => {
        const label = option.charAt(0).toUpperCase() + option.slice(1)

        return (
          <button
            key={option}
            type="button"
            aria-pressed={breakpoint === option}
            onClick={() => onChange(option)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
