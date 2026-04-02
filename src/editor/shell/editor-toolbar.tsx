export interface EditorToolbarProps {
  canUndo: boolean
  canRedo: boolean
}

export function EditorToolbar({ canUndo, canRedo }: EditorToolbarProps) {
  return (
    <header aria-label="Editor toolbar">
      <strong>EmCanvas</strong>
      <div>
        <button type="button" disabled={!canUndo}>
          Undo
        </button>
        <button type="button" disabled={!canRedo}>
          Redo
        </button>
        <button type="button">Preview</button>
      </div>
    </header>
  )
}
