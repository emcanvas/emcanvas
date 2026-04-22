import type { EditorBreakpoint } from '../state/editor-store'

export interface EditorStatusbarProps {
  breakpoint: EditorBreakpoint
  dirty: boolean
}

export function EditorStatusbar({ breakpoint, dirty }: EditorStatusbarProps) {
  return (
    <footer aria-label="Editor statusbar" className="emc-editor-statusbar">
      <span>Breakpoint: {breakpoint}</span>
      <span>{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
    </footer>
  )
}
