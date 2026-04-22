export interface PreviewActionsProps {
  previewUrl: string
  onPublish: () => Promise<void> | void
}

export function PreviewActions({ previewUrl, onPublish }: PreviewActionsProps) {
  return (
    <div
      role="group"
      aria-label="Preview and publish actions"
      className="emc-preview-actions"
    >
      <a href={previewUrl} className="emc-preview-actions__link">
        Open preview
      </a>
      <button
        type="button"
        className="emc-preview-actions__publish"
        onClick={() => void onPublish()}
      >
        Publish
      </button>
    </div>
  )
}

export default PreviewActions
