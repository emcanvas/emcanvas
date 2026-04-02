export interface PreviewActionsProps {
  previewUrl: string
  onPublish: () => Promise<void> | void
}

export function PreviewActions({ previewUrl, onPublish }: PreviewActionsProps) {
  return (
    <div>
      <a href={previewUrl}>Open preview</a>
      <button type="button" onClick={() => void onPublish()}>
        Publish
      </button>
    </div>
  )
}

export default PreviewActions
