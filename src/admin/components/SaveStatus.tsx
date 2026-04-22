export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export interface SaveStatusProps {
  state: SaveState
  message?: string | null
}

export function SaveStatus({ state, message }: SaveStatusProps) {
  const label =
    state === 'saving'
      ? 'Saving changes'
      : state === 'saved'
        ? 'Changes published'
        : state === 'error'
          ? (message ?? 'Unable to publish changes')
          : 'Ready to publish'

  return (
    <p
      role="status"
      aria-label="Publish status"
      aria-live="polite"
      className={`emc-save-status emc-save-status--${state}`}
    >
      {label}
    </p>
  )
}

export default SaveStatus
