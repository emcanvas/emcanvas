export interface EditorToolbarProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

export function EditorToolbar({ canUndo, canRedo, onUndo, onRedo }: EditorToolbarProps) {
  return (
    <header aria-label="Editor toolbar">
      <strong>EmCanvas</strong>
      <div>
        <button type="button" disabled={!canUndo} onClick={onUndo}>
          Undo
        </button>
        <button type="button" disabled={!canRedo} onClick={onRedo}>
          Redo
        </button>
        <button type="button">Preview</button>
      </div>
    </header>
  )
}
