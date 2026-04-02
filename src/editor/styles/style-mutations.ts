import type { ResponsiveStyles } from '../../foundation/types/canvas'
import type { EditorBreakpoint } from '../state/editor-store'

export function getBreakpointStyles(
  styles: ResponsiveStyles,
  breakpoint: EditorBreakpoint,
): Record<string, unknown> {
  return styles[breakpoint] ?? {}
}

export function updateResponsiveStyles(
  styles: ResponsiveStyles,
  breakpoint: EditorBreakpoint,
  patch: Record<string, unknown>,
): ResponsiveStyles {
  const nextBreakpointStyles = {
    ...getBreakpointStyles(styles, breakpoint),
    ...patch,
  }

  return {
    ...styles,
    [breakpoint]: nextBreakpointStyles,
  }
}
