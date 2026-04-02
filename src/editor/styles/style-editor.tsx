import type { ResponsiveStyles } from '../../foundation/types/canvas'
import type { EditorBreakpoint } from '../state/editor-store'
import { BreakpointSwitcher } from './breakpoint-switcher'
import { getBreakpointStyles } from './style-mutations'
import { ColorField } from './style-fields/color-field'
import { SizeField } from './style-fields/size-field'
import { SpacingField } from './style-fields/spacing-field'
import { TypographyField } from './style-fields/typography-field'

export interface StyleEditorProps {
  styles: ResponsiveStyles
  breakpoint: EditorBreakpoint
  onBreakpointChange: (breakpoint: EditorBreakpoint) => void
  onChange: (patch: Record<string, unknown>) => void
}

export function StyleEditor({ styles, breakpoint, onBreakpointChange, onChange }: StyleEditorProps) {
  const currentStyles = getBreakpointStyles(styles, breakpoint)

  return (
    <section aria-label="Style editor">
      <h3>Styles</h3>
      <BreakpointSwitcher breakpoint={breakpoint} onChange={onBreakpointChange} />
      <SpacingField styles={currentStyles} onChange={onChange} />
      <SizeField styles={currentStyles} onChange={onChange} />
      <ColorField styles={currentStyles} onChange={onChange} />
      <TypographyField styles={currentStyles} onChange={onChange} />
    </section>
  )
}
