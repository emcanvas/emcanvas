export interface EditorToolbarProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

export function EditorToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: EditorToolbarProps) {
  return (
    <header aria-label="Editor toolbar" className="emc-editor-toolbar">
      <div className="emc-editor-toolbar__brand">
        <strong>Canvas</strong>
        <span>Focused editing</span>
      </div>
      <div className="emc-editor-toolbar__actions">
        <button type="button" disabled={!canUndo} onClick={onUndo}>
          Undo
        </button>
        <button type="button" disabled={!canRedo} onClick={onRedo}>
          Redo
        </button>
        <button type="button" className="emc-editor-toolbar__ghost-action">
          Preview
        </button>
      </div>
    </header>
  )
}
